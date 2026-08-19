const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const characterStatusEnums = require('./../../enums/characterStatusEnums');

/** @typedef {[number, number, number]} Point */

/**
 * @param {Point[]} points
 * @returns {Point}
 */
function getRandomPointInPolygon(points) {
    // Находим ограничивающий прямоугольник (bounding box)
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const point of points) {
        minX = Math.min(minX, point[0]);
        maxX = Math.max(maxX, point[0]);
        minY = Math.min(minY, point[1]);
        maxY = Math.max(maxY, point[1]);
    }

    // Округляем границы в большую сторону
    minX = Math.floor(minX);
    maxX = Math.ceil(maxX);
    minY = Math.floor(minY);
    maxY = Math.ceil(maxY);

    // Генерируем случайные точки пока не найдем внутри полигона
    let randomPoint, isInside;
    do {
        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        // Округляем координаты в большую сторону
        randomPoint = [Math.ceil(x), Math.ceil(y), points[0][2]]; // Сохраняем Z-координату

        isInside = isPointInPolygon(/** @type {Point} */ (randomPoint), points);
    } while (!isInside);

    return /** @type {Point} */ (randomPoint);
}

/**
 * Функция проверки нахождения точки внутри полигона (алгоритм ray casting)
 * @param {Point} point
 * @param {Point[]} polygon
 * @returns {boolean}
 */
function isPointInPolygon(point, polygon) {
    const x = point[0], y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}
//

class RequestRestartPoint {
  static code = 0x6D;

  /**
   * @param {import('../Client')} client
   * @param {Buffer} packet
   */
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get requestedPointType() {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (!player) return;

    // TODO for beta release
    const randomPoint = getRandomPointInPolygon(
      [
        [-83404, 244218, -3730],
        [-83185, 243890, -3730],
        [-83804, 243184, -3730],
        [-84200, 243493, -3730]
      ]
    );

    player.x = randomPoint[0];
    player.y = randomPoint[1];
    player.z = randomPoint[2];

    this._client.sendPacket(new serverPackets.TeleportToLocation(player.objectId, player.x, player.y, player.z));
    //

    this._client.sendPacket(new serverPackets.Revive(player.objectId));

    player.isDead = false; // fix
    player.hp = player.maximumHp - 30; // fix

    this._client.sendPacket(new serverPackets.StatusUpdate(player.objectId, [
      {
        id: characterStatusEnums.CUR_HP,
        value: player.hp,
      },
      {
        id: characterStatusEnums.MAX_HP,
        value: player.maximumHp,
      }
    ]));
  }
}

module.exports = RequestRestartPoint;