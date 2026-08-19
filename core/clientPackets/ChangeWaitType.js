const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class ChangeWaitType extends ClientPacketNew {
  static code = 0x1D;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const type = this.readD();

    if (!player) return;

    client.sendPacket(new serverPackets.ChangeWaitType(player, type));
  }
}

module.exports = ChangeWaitType;