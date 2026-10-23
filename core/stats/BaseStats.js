class BaseStats {
  constructor() {
    this._str = null;
    this._dex = null;
    this._con = null;
    this._int = null;
    this._wit = null;
    this._men = null;
  }

  getStr() {
    return this._str;
  }

  setStr(value) {
    this._str = value;
  }

  getDex() {
    return this._dex;
  }

  setDex(value) {
    this._dex = value;
  }

  getCon() {
    return this._con;
  }

  setCon(value) {
    this._con = value;
  }

  getInt() {
    return this._int;
  }

  setInt(value) {
    this._int = value;
  }

  getWit() {
    return this._wit;
  }

  setWit(value) {
    this._wit = value;
  }

  getMen() {
    return this._men;
  }

  setMen(value) {
    this._men = value;
  }
}

module.exports = BaseStats;