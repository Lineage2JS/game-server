const ServerPacket = require('./ServerPacket.js');

class MagicSkillUse extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {*} skill
   */
  constructor(character, skill) {
    super();
    this
      .writeC(0x5A)
      .writeD(character.objectId)
      .writeD(character.target)
      .writeD(skill.id)
      .writeD(skill.level)
      .writeD(skill.hitTime)
      .writeD(skill.reuseDelay)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z)
      .writeH(0x00);
  }
}

module.exports = MagicSkillUse;