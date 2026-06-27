const ServerPacket = require('./ServerPacket.js');

class AcquireSkillInfo extends ServerPacket {
  /**
   * @param {number} skillId
   * @param {number} skillLevel
   * @param {number} spCost
   * @param {number} requirements
   */
  constructor(skillId, skillLevel, spCost, requirements) {
    super();
    this
      .writeC(0xA4)
      .writeD(skillId)
      .writeD(skillLevel)
      .writeD(spCost)
      .writeD(requirements)
  }
}

module.exports = AcquireSkillInfo;