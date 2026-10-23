class BaseStats {
  constructor() {
    this._str = null;
  }

  getStr() {
    return this._str;
  }

  setStr(value) {
    this._str = value;
  }
}

module.exports = BaseStats;