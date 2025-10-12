class Skills {
    constructor() {
      this._skills = new Map();

      this._skills.set(1216, {
        id: 1216,
        level: 1,
        passive: false,
      });
    }
  
    // addSkill(skill) {  
    //   this._skills.push(skill);
    // }
  
    getSkills() {
      return Array.from(this._skills.values());
    }
  }
  
  module.exports = Skills;