/** @typedef {{ skillId: number, skillLevel: number }} SkillInput */
/** @typedef {{ id: number, level: number, passive: number }} SkillEntry */

class Skills {
  constructor() {
    /** @type {Map<number, SkillEntry>} */
    this._skills = new Map();
  }

  /** @param {SkillInput} skill */
  addSkill(skill) {
    this._skills.set(skill.skillId, {
      id: skill.skillId,
      level: skill.skillLevel,
      passive: 0,
    });
  }

  /** @returns {SkillEntry[]} */
  getSkills() {
    return Array.from(this._skills.values());
  }
}

module.exports = Skills;
