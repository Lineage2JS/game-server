const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const serverPackets = require('./../ServerPackets/serverPackets');

class MoveBackwardToLocation {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get targetX() {
    return this._data.getData()[0];
  }

  get targetY() {
    return this._data.getData()[1];
  }

  get targetZ() {
    return this._data.getData()[2];
  }

  get originX() {
    return this._data.getData()[3];
  }

  get originY() {
    return this._data.getData()[4];
  }

  get originZ() {
    return this._data.getData()[5];
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

    const dx = path.origin.x - path.target.x;
    const dy = path.origin.y - path.target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 25) { // TODO fix magic number
      this._client.sendPacket(new serverPackets.ActionFailed());

      return;
    }

    player.updateParams({
      x: this.originX,
      y: this.originY,
      z: this.originZ
    });
    player.setAction('move', path);
  }
}

module.exports = MoveBackwardToLocation;