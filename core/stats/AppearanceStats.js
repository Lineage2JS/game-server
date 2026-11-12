class AppearanceStats {
  constructor() {
    this._hairStyle = null;
    this._hairColor = null;
    this._face = null;
    this._gender = null;
    this._classId = null;
    this._raceId = null;
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

  getGender() {
    return this._gender;
  }

  setGender(value) {
    this._gender = value;
  }

  getClassId() {
    return this._classId;
  }

  setClassId(value) {
    this._classId = value;
  }

  getRaceId() {
    return this._raceId;
  }

  setRaceId(value) {
    this._raceId = value;
  }
}

module.exports = AppearanceStats;