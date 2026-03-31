const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class NetPing extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const ping = this.readD();
    const mtu = this.readD();

    client.sendPacket(new serverPackets.ActionFailed());
  }
}

module.exports = NetPing;