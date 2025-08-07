const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');

class Say2 {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS()
      .readD();

    this._init();
  }

  get text() {
    return this._data.getData()[0];
  }
	
  get type() {
    return this._data.getData()[1];
  }
  
  get target() {
    return this._data.getData()[2];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.CreateSay(player, this.type, this.text));
  }
}

module.exports = Say2;