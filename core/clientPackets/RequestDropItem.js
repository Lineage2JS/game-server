const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestDropItem {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get objectId() {
    return this._data.getData()[0];
  }

  get count() {
    return this._data.getData()[1];
  }

  get x() {
    return this._data.getData()[2];
  }

  get y() {
    return this._data.getData()[3];
  }

  get z() {
    return this._data.getData()[4];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    player.emit('dropItem', this.objectId, this.x, this.y, this.z);
  }
}

module.exports = RequestDropItem;