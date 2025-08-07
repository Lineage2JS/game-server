const ServerPacket = require('./ServerPacket.js'); 

class AcquireSkillList {
  constructor(skills) {
    this._packet = new ServerPacket();
    this._packet.writeC(0xA3)
      .writeD(skills.length);
    
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      this._packet.writeD(skill.id)
        .writeD(skill.nextLevel)
        .writeD(skill.maxLevel)
        .writeD(skill.spCost)
        .writeD(skill.requirements);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AcquireSkillList;