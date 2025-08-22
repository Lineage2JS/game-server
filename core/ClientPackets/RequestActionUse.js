const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestActionUse {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get actionId() {
    return this._data.getData()[0];
  }
  
  get ctrlStatus() {
    return this._data.getData()[1];
  }
  
  get shiftStatus() {
    return this._data.getData()[2];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.actionId === 0) {
      player.waitType = !player.waitType;

      this._client.sendPacket(new serverPackets.ChangeWaitType(player, player.waitType));

      return;
    }

    if (this.actionId === 1) {
      player.moveType = !player.moveType;

      this._client.sendPacket(new serverPackets.ChangeMoveType(player.objectId, player.moveType));

      return;
    }
  }
}

module.exports = RequestActionUse;