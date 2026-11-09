class SocialStats {
  constructor() {
    this._pvp = 0;
    this._pk = 0;
    this._karma = 0;
  }

  getPvp() {
    return this._pvp;
  }

  setPvp(value) {
    this._pvp = value;
  }

  getPk() {
    return this._pk;
  }

  setPk(value) {
    this._pk = value;
  }

  getKarma() {
    return this._karma;
  }

  setKarma(value) {
    this._karma = value;
  }
}

module.exports = SocialStats;