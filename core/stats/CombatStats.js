class CombatStats {
  constructor() {    
    this._pAtk = null;
    this._pDef = null;
    this._mSpd = null;
    this._pSpd = null;
    this._maleAttackSpeedMultiplier = null;
    this._femaleAttackSpeedMultiplier = null;
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

  getMSpd() {
    return this._mSpd;
  }

  setMSpd(value) {
    this._mSpd = Math.floor(value);
  }

  getPSpd() {
    return this._pSpd;
  }

  setPSpd(value) {
    this._pSpd = Math.floor(value);
  }

  getMaleAttackSpeedMultiplier() {
    return this._maleAttackSpeedMultiplier;
  }

  setMaleAttackSpeedMultiplier(value) {
    this._maleAttackSpeedMultiplier = value;
  }

  getFemaleAttackSpeedMultiplier() {
    return this._femaleAttackSpeedMultiplier;
  }

  setFemaleAttackSpeedMultiplier(value) {
    this._femaleAttackSpeedMultiplier = value;
  }
}

module.exports = CombatStats;