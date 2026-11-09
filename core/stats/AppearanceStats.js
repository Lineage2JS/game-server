class AppearanceStats {
  constructor() {
    this._hairStyle = null;
    this._hairColor = null;
    this._face = null;
  }

  getHairStyle() {
    return this._hairStyle;
  }

  setHairStyle(value) {
    this._hairStyle = value;
  }

  getHairColor() {
    return this._hairColor;
  }

  setHairColor(value) {
    this._hairColor = value;
  }

  getFace() {
    return this._face;
  }

  setFace(value) {
    this._face = value;
  }
}

module.exports = AppearanceStats;