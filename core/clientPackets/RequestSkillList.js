const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestSkillList extends ClientPacketNew {
  handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const skills = player.getSkills();

    client.sendPacket(new serverPackets.SkillList(skills));
  }
}

module.exports = RequestSkillList;