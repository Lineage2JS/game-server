const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const adminPanelManager = require('./../Managers/AdminPanelManager');

class SendBypassBuildCmd {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS();

    this._init();
  }
  
  get command() {
    return this._data.getData()[0];
  }

  async _init() {
    if (this.command === 'admin') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('panel');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
    }
  }
}

module.exports = SendBypassBuildCmd;