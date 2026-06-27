const ClientPacketNew = require("./ClientPacketNew");
const serverPackets = require('./../ServerPackets/serverPackets');
const { inRange } = require('./../../utils/distance');

class MoveBackwardToLocation extends ClientPacketNew {
  static code = 0x01;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const targetX = this.readD();
    const targetY = this.readD();
    const targetZ = this.readD();
    const originX = this.readD();
    const originY = this.readD();
    const originZ = this.readD();

    if (!player) return;

    if (inRange({ x: originX, y: originY }, { x: targetX, y: targetY }, 25)) { // TODO fix magic number
      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }

    player.updateParams({
      x: originX,
      y: originY,
      z: originZ
    });
    player.doAction('move', targetX, targetY, targetZ);
  }
}

module.exports = MoveBackwardToLocation;