const ServerPacket = require('./ServerPacket.js');

class AcquireSkillList extends ServerPacket {
  /**
   * @param {any[]} skills
   */
  constructor(skills) {
    super();
    this
      .writeC(0xA3)
      .writeD(skills.length);

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      this
        .writeD(skill.id)
        .writeD(skill.nextLevel)
        .writeD(skill.maxLevel)
        .writeD(skill.spCost)
        .writeD(skill.requirements);
    }
  }
}

module.exports = AcquireSkillList;