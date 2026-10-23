const BaseStats = require('./BaseStats');

class CharacterStats extends BaseStats { // TODO CombatStats?
  constructor() {
    super();
    
    this._pAtk = null;
    this._pDef = null;
  }
  
  getPAtk() {
    return this._pAtk;
  }

  setPAtk(value) {
    this._pAtk = Math.floor(value);
  }

  getPDef() {
    return this._pDef;
  }

  setPDef(value) {
    this._pDef = Math.floor(value);
  }
}

module.exports = CharacterStats;