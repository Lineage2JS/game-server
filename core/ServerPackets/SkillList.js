const ServerPacket = require('./ServerPacket.js');

class SkillList extends ServerPacket {
  /**
   * @param {Array<{passive: number, level: number, id: number}>} skills
   */
  constructor(skills) {
    super();
    this
      .writeC(0x6D)
      .writeD(skills.length);

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      this.writeD(skill.passive)
        .writeD(skill.level)
        .writeD(skill.id);
    }
  }
}

module.exports = SkillList;