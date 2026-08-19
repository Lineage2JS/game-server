const ServerPacket = require('./ServerPacket.js');

class MagicSkillLaunched extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {*} skill
   */
  constructor(character, skill) {
    super();
    this
      .writeC(0x8E)
      .writeD(character.objectId)
      .writeD(skill.id)
      .writeD(skill.level)
      .writeD(1)
      .writeD(character.target);
  }
}

module.exports = MagicSkillLaunched;