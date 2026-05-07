const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestTargetCanceled extends ClientPacketNew {
  handle() {
    const client = this.getClient();
    const player = this.getPlayer();

    client.sendPacket(new serverPackets.TargetUnselected(player));

    player.target = null;
  }
}

module.exports = RequestTargetCanceled;