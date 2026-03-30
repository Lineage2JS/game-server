const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestSocialAction extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const actionId = this.readD();

    client.sendPacket(new serverPackets.SocialAction(player.objectId, actionId));
  }
}

module.exports = RequestSocialAction;