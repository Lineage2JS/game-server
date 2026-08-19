const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class FinishRotating extends ClientPacketNew {
  static code = 0x4B;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const degree = this.readD();
    const unknown = this.readD();

    if (!player) return;

    client.sendPacket(new serverPackets.FinishRotating(player, degree));
  }
}

module.exports = FinishRotating;