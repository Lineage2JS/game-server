const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

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
  }
}

module.exports = RequestRestartPoint;