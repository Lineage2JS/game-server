const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const npcHtmlMessagesManager = require('../Managers/NpcHtmlMessagesManager');

class RequestLinkHtml {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS();

    this._init();
  }

  get link () {
    return this._data.getData()[0];
  }

  async _init() {
    const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName(this.link);

    this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
  }
}

module.exports = RequestLinkHtml;