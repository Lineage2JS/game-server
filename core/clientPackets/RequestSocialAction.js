const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestSocialAction extends ClientPacketNew {
  static code = 0x1B;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const actionId = this.readD();

    if (!player) return;

    client.sendPacket(new serverPackets.SocialAction(player.objectId, actionId));
  }
}

module.exports = RequestSocialAction;