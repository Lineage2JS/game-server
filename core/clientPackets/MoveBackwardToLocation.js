const ClientPacketNew = require("./ClientPacketNew");
const serverPackets = require('./../ServerPackets/serverPackets');

class MoveBackwardToLocation extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const targetX = this.readD();
    const targetY = this.readD();
    const targetZ = this.readD();
    const originX = this.readD();
    const originY = this.readD();
    const originZ = this.readD();
    const path = {
      target: {
        x: targetX,
        y: targetY,
        z: targetZ
      },
      origin: {
        x: originX,
        y: originY,
        z: originZ
      }
    }
    const dx = path.origin.x - path.target.x;
    const dy = path.origin.y - path.target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 25) { // TODO fix magic number
      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }

    player.updateParams({
      x: originX,
      y: originY,
      z: originZ
    });
    player.doAction('move', path);
  }
}

module.exports = MoveBackwardToLocation;