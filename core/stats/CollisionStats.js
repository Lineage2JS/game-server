class CollisionStats {
  constructor() {
    this._maleCollisionRadius = null;
    this._maleCollisionHeight = null;
    this._femaleCollisionRadius = null;
    this._femaleCollisionHeight = null;
  }

  getMaleCollisionRadius() {
    return this._maleCollisionRadius;
  }

  setMaleCollisionRadius(value) {
    this._maleCollisionRadius = value;
  }

  getMaleCollisionHeight() {
    return this._maleCollisionHeight;
  }

  setMaleCollisionHeight(value) {
    this._maleCollisionHeight = value;
  }

  getFemaleCollisionRadius() {
    return this._femaleCollisionRadius;
  }

  setFemaleCollisionRadius(value) {
    this._femaleCollisionRadius = value;
  }

  getFemaleCollisionHeight() {
    return this._femaleCollisionHeight;
  }

  setFemaleCollisionHeight(value) {
    this._femaleCollisionHeight = value;
  }
}

module.exports = CollisionStats;