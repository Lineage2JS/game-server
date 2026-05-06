const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestAcquireSkillInfo extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const skillId = this.readD();
    const skillLevel = this.readD();

    client.sendPacket(new serverPackets.AcquireSkillInfo(skillId, skillLevel, 100, 0));
  }
}

module.exports = RequestAcquireSkillInfo;