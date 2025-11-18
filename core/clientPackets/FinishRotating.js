const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class FinishRotating {
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

  get unknown() { // finx find?
    return this._data.getData()[1];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    
    this._client.sendPacket(new serverPackets.FinishRotating(player, this.degree, 0));
  }
}

module.exports = FinishRotating;