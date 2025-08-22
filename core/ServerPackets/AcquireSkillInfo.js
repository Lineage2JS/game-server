const ServerPacket = require('./ServerPacket.js'); 

class AcquireSkillInfo {
  constructor(skillId, skillLevel, spCost, requirements) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0xA4)
      .writeD(skillId)
      .writeD(skillLevel)
      .writeD(spCost)
      .writeD(requirements)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AcquireSkillInfo;