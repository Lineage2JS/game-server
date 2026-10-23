const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const communityBoardManager = require('./../Managers/CommunityBoardManager');

class RequestShowBoard extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const unknown = this.readD(); // TODO
    const htmlMessage = communityBoardManager.getHtmlMessageByFileName('main.htm');

    client.sendPacket(new serverPackets.ShowBoard(htmlMessage));
  }
}

module.exports = RequestShowBoard;