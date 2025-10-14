const BasePayload = require('./BasePayload');

class CastPayload extends BasePayload {
  constructor(data) {
    super();
    
    this._target = data.target;
    this._skill = data.skill;
  }

  getTarget() {
    return this._target;
  }

  getSkill() {
    return this._skill;
  }
}

module.exports = CastPayload;