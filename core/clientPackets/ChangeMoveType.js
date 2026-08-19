const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class ChangeMoveType extends ClientPacketNew {
  static code = 0x1C;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const type = this.readD();

    if (!player?.objectId) return;

    client.sendPacket(new serverPackets.ChangeMoveType(player.objectId, type));
  }
}

module.exports = ChangeMoveType;