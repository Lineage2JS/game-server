const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestQuestList extends ClientPacketNew {
  static code = 0x63;

  handle() {
    const client = this.getClient();
    const player = this.getPlayer();

    if (!player) return;

    client.sendPacket(new serverPackets.QuestList(player.getQuests().filter(quest => quest.isCompleted === false)));
  }
}

module.exports = RequestQuestList;