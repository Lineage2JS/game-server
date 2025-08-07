const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const communityBoardManager = require('./../Managers/CommunityBoardManager');

class RequestShowBoard {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  async _init() {
    const htmlMessage = communityBoardManager.getHtmlMessageByFileName('main');

    this._client.sendPacket(new serverPackets.ShowBoard(htmlMessage));
  }
}

module.exports = RequestShowBoard;