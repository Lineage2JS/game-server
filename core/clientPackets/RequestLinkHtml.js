const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const npcHtmlMessagesManager = require('../Managers/NpcHtmlMessagesManager');

class RequestLinkHtml extends ClientPacketNew {
  static code = 0x20;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const link = this.readS();
    const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName(link);

    client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
  }
}

module.exports = RequestLinkHtml;