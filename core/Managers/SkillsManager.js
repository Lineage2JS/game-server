const Skill = require('./../Models/Skill');
const skillsList = require('./../../datapack/skills.json');

/** @typedef {{ skill_id: number, target_type: number }} SkillData */
/** @typedef {{ skillId: number, targetType: number }} SkillInitData */

class SkillsManager {
  constructor() {
    /** @type {Map<number, Skill>} */
    this._skillsTable = new Map();
  }

  /** @returns {void} */
  enable() {
    this._loadSkillTemplates();
  }

  /**
   * @param {number} skillId
   * @returns {Skill}
   */
  getSkill(skillId) {
    const skillTemplate = this._getSkillTemplate(skillId);

    return this._createSkill(skillTemplate);
  }

  /**
   * @param {Skill} skillTemplate
   * @returns {Skill}
   */
  _createSkill(skillTemplate) {
    /** @type {SkillInitData} */
    const data = {
      skillId: skillTemplate.getSkillId(),
      targetType: skillTemplate.getTargetType(),
    }
    const skill = new Skill(data);

    return skill;
  }

  /** @returns {void} */
  _loadSkillTemplates() {
    for(const skillData of /** @type {SkillData[]} */ (skillsList)) {
      this._createSkillTemplate(skillData);
    }
  }

  /**
   * @param {SkillData} skillData
   * @returns {void}
   */
  _createSkillTemplate(skillData) {
    /** @type {SkillInitData} */
    const data = {
      skillId: skillData.skill_id,
      targetType: skillData.target_type
    };
    const skill = new Skill(data);

    this._addSkill(skill.getSkillId(), skill);
  }

  /**
   * @param {number} skillId
   * @param {Skill} skill
   * @returns {void}
   */
  _addSkill(skillId, skill) {
    this._skillsTable.set(skillId, skill);
  }

  /**
   * @param {number} skillId
   * @returns {Skill}
   */
  _getSkillTemplate(skillId) {
    return /** @type {Skill} */ (this._skillsTable.get(skillId));
  }
}

module.exports = new SkillsManager();