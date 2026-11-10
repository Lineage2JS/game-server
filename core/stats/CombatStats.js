class CombatStats {
  constructor() {    
    this._pAtk = null;
    this._pSpd = null;
    this._pDef = null;
    this._evasion = null;
    this._accuracy = null;
    this._critical = null;
    this._mAtk = null;
    this._mSpd = null;
    this._mDef = null;
    this._maleAttackSpeedMultiplier = null;
    this._femaleAttackSpeedMultiplier = null;
  }
  
  getPAtk() {
    return this._pAtk;
  }

  setPAtk(value) {
    this._pAtk = Math.floor(value);
  }

  getPSpd() {
    return this._pSpd;
  }

  setPSpd(value) {
    this._pSpd = Math.floor(value);
  }

  getPDef() {
    return this._pDef;
  }

  setPDef(value) {
    this._pDef = Math.floor(value);
  }

  getEvasion() {
    return this._evasion;
  }

  setEvasion(value) {
    this._evasion = value;
  }

  getAccuracy() {
    return this._accuracy;
  }

  setAccuracy(value) {
    this._accuracy = value;
  }

  getCritical() {
    return this._critical;
  }

  setCritical(value) {
    this._critical = value;
  }

  getMAtk() {
    return this._mAtk;
  }

  setMAtk(value) {
    this._mAtk = Math.floor(value);
  }

  getMSpd() {
    return this._mSpd;
  }

  setMSpd(value) {
    this._mSpd = Math.floor(value);
  }

  getMDef() {
    return this._mDef;
  }

  setMDef(value) {
    this._mDef = Math.floor(value);
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