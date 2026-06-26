/**
 * @typedef {object} SkillData
 * @property {number} skillId
 * @property {number} targetType
 */

class Skill {
  /** @param {SkillData} data */
  constructor(data) {
    /** @type {number} */
    this._skillId = data.skillId;
    /** @type {number} */
    this._targetType = data.targetType;
  }

  /** @returns {number} */
  getSkillId() {
    return this._skillId;
  }

  /** @returns {number} */
  getTargetType() {
    return this._targetType;
  }
}

module.exports = Skill;