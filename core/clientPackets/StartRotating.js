const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class StartRotating extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const degree = this.readD();
    const side = this.readD();
    
    client.sendPacket(new serverPackets.StartRotating(player, degree, side));
  }
}

module.exports = StartRotating;