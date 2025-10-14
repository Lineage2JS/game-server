class Skill {
  constructor(data) {
    this._skillId = data.skillId;
    this._targetType = data.targetType;
  }

  getSkillId() {
    return this._skillId;
  }

  getTargetType() {
    return this._targetType;
  }
}

module.exports = Skill;