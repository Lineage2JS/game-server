const Item = require('./Item');

class ItemWeapon extends Item {
  constructor(data) {
    super(data);

    this._weaponType = data.weaponType;
  }

  getWeaponType() {
    return this._weaponType;
  }
}

module.exports = ItemWeapon;