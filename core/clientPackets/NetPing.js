const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class NetPing {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readD()

    this._init();
  }

  get objectId() {
    return this._data.getData()[0];
  }

  get ping() {
    return this._data.getData()[1];
  }

  get mtu() {
    return this._data.getData()[2];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.ActionFailed());
  }
}

module.exports = NetPing;