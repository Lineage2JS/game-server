const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class MoveBackwardToLocation {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get targetX() {
    return this._data.getData()[1];
  }
  get targetY() {
    return this._data.getData()[2];
  }
  get targetZ() {
    return this._data.getData()[3];
  }
  get originX() {
    return this._data.getData()[4];
  }
  get originY() {
    return this._data.getData()[5];
  }
  get originZ() {
    return this._data.getData()[6];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const path = {
      target: {
        x: this.targetX,
        y: this.targetY,
        z: this.targetZ
      },
      origin: {
        x: this.originX,
        y: this.originY,
        z: this.originZ
      }
    }

    player.updateParams({
      x: this.originX,
      y: this.originY,
      z: this.originZ
    });
    player.updateJob('move', path);
  }
}

module.exports = MoveBackwardToLocation;