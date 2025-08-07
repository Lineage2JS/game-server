const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestAttack {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get objectId() {
    return this._data.getData()[0];
  }

  get x() {
    return this._data.getData()[1];
  }

  get y() {
    return this._data.getData()[2];
  }

  get z() {
    return this._data.getData()[3];
  }

  get attackId() {
    return this._data.getData()[4]; // 0 - click, 1 - shift click
  }

  _init() {
    const player = playersManager.getPlayerByClient(this._client);
    
    if (!player.isAttacking) {
      player.isAttacking = true;
      
      player.updateJob('attack', this.objectId);
    }
  }
}

module.exports = RequestAttack;