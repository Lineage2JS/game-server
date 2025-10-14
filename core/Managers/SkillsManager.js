const Skill = require('./../Models/Skill');
const skillsList = require('./../../datapack/skills.json');

class SkillsManager {
  constructor() {
    this._skillsTable = new Map();
  }

  enable() {
    this._loadSkillTemplates();
  }

  getSkill(skillId) {
    const skillTemplate = this._getSkillTemplate(skillId);

    return this._createSkill(skillTemplate);
  }

  _createSkill(skillTemplate) {
    const data = {
      skillId: skillTemplate.getSkillId(),
      targetType: skillTemplate.getTargetType(),
    }
    const skill = new Skill(data);

    return skill;
  }

  _loadSkillTemplates() {
    for(const skillData of skillsList) {
      this._createSkillTemplate(skillData);
    }
  }

  _createSkillTemplate(skillData) {
    const data = {
      skillId: skillData.skill_id,
      targetType: skillData.target_type
    }        
    const skill = new Skill(data);

    this._addSkill(skill.getSkillId(), skill);
  }

  _addSkill(skillId, skill) {
    this._skillsTable.set(skillId, skill);
  }

  _getSkillTemplate(skillId) {
    return this._skillsTable.get(skillId);
  }
}

module.exports = new SkillsManager();