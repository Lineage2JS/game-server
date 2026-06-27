const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestSkillList extends ClientPacketNew {
  static code = 0x3F;

  handle() {
    const client = this.getClient();
    const player = this.getPlayer();

    if (!player) return;

    const skills = player.getSkills();

    client.sendPacket(new serverPackets.SkillList(skills));
  }
}

module.exports = RequestSkillList;