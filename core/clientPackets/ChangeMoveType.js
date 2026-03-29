const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class ChangeMoveType extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const type = this.readD();

    client.sendPacket(new serverPackets.ChangeMoveType(player.objectId, type));
  }
}

module.exports = ChangeMoveType;