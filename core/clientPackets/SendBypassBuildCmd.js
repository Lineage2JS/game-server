const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const adminPanelManager = require('./../Managers/AdminPanelManager');

class SendBypassBuildCmd extends ClientPacketNew {
  static code = 0x5B;

  handle() {
    const client = this.getClient();
    const command = this.readS();

    if (command === 'admin') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('panel');

      client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
    }
  }
}

module.exports = SendBypassBuildCmd;