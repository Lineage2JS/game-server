const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const characterStatusEnums = require('./../../enums/characterStatusEnums');

class RequestRestartPoint {
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

    this._client.sendPacket(new serverPackets.Revive(player.objectId));

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