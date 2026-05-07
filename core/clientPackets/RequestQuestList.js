const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestQuestList extends ClientPacketNew {
  handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    
    client.sendPacket(new serverPackets.QuestList(player.getQuests().filter(quest => quest.isCompleted === false)));
  }
}

module.exports = RequestQuestList;