const BaseState = require("./BaseState");

//
const entitiesManager = require('./../Managers/EntitiesManager');
const serverPackets = require('./../ServerPackets/serverPackets');
//

//
//const database = require('./../../database');
//

function moveCloser(x1, y1, x2, y2, distance) {
  // Вычисляем разницу между координатами
  let dx = x2 - x1;
  let dy = y2 - y1;

  // Вычисляем расстояние между точками
  let dist = Math.sqrt(dx * dx + dy * dy);

  // Нормализуем вектор разницы
  let nx = dx / dist;
  let ny = dy / dist;

  // Перемещаем точку (x2, y2) ближе на заданное расстояние
  let newX = x2 - nx * distance;
  let newY = y2 - ny * distance;

  return { x: newX, y: newY };
}

class FollowState extends BaseState {
  async enter() {
    if (!this.character.isMoving) {
      this.character.emit('startedMoving');

      this.character.positionUpdateTimestamp = Date.now();
      this.character.isMoving = true;
    }

    //
    //this._objId = await database.getNextObjectId();
    //
  }

  update() {     
    const entity = entitiesManager.getEntityByObjectId(this.character.target);

    this.character.path.origin.x = this.character.x;
    this.character.path.origin.y = this.character.y;
    this.character.path.target.x = entity.x;
    this.character.path.target.y = entity.y;

    const p = moveCloser(this.character.path.origin.x, this.character.path.origin.y, this.character.path.target.x, this.character.path.target.y, 20);

    this.character.path.target.x = p.x;
    this.character.path.target.y = p.y;

    this.character.emit('move');
    this.character.updatePosition(this.character.lastUpdateTimestamp);

    // this.character._client.sendPacket(new serverPackets.DropItem(this.character, {
    //   objectId: this._objId++,
    //   itemId: 57,
    //   x: this.character.x,
    //   y: this.character.y,
    //   z: this.character.z
    // }));
  }

  leave() {
    
  }
}

module.exports = FollowState;