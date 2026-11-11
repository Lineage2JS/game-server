class ProgressStats {
  constructor() {
    this._exp = 0;
    this._sp = 0;
  }

  getExp() {
    return this._exp;
  }

  setExp(value) {
    this._exp = value;
  }

  getSp() {
    return this._sp;
  }

  setSp(value) {
    this._sp = value;
  }
}

module.exports = ProgressStats;