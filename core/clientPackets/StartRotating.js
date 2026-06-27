const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class StartRotating extends ClientPacketNew {
  static code = 0x4A;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const degree = this.readD();
    const side = this.readD();

    if (!player) return;

    client.sendPacket(new serverPackets.StartRotating(player, degree, side));
  }
}

module.exports = StartRotating;