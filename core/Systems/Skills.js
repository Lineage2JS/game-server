class Skills {
    constructor() {
      this._skills = new Map();
    }
  
    addSkill(skill) {  
      this._skills.set(skill.skillId, {
        id: skill.skillId,
        level: skill.skillLevel,
        passive: false,
      });
    }
  
    getSkills() {
      return Array.from(this._skills.values());
    }
  }
  
  module.exports = Skills;