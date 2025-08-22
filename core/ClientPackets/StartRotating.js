const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class StartRotating {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD();

    this._init();
  }

  get degree() {
    return this._data.getData()[0];
  }

  get side() {
    return this._data.getData()[1];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    
    this._client.sendPacket(new serverPackets.StartRotating(player, this.degree, this.side));
  }
}

module.exports = StartRotating;