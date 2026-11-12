class AccessStats {
  constructor() {
    this._accessLevel = null;
    this._gm = null;
  }

  getAccessLevel() {
    return this._accessLevel;
  }

  setAccessLevel(value) {
    this._accessLevel = value;
  }

  getGm() {
    return this._gm;
  }

  setGm(value) {
    this._gm = value;
  }
}

module.exports = AccessStats;