const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestTargetCanceled extends ClientPacketNew {
  static code = 0x37;

  handle() {
    const client = this.getClient();
    const player = this.getPlayer();

    if (!player) return;

    client.sendPacket(new serverPackets.TargetUnselected(player));

    player.target = 0;
  }
}

module.exports = RequestTargetCanceled;