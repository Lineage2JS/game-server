const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestAcquireSkill extends ClientPacketNew {
  static code = 0x6C;

  async handle() {
    const client = this.getClient();
    const skillId = this.readD();
    const skillLevel = this.readD();

    client.sendPacket(new serverPackets.AcquireSkillDone());
  }
}

module.exports = RequestAcquireSkill;