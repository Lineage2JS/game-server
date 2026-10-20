const Item = require('./Item');

class ItemWeapon extends Item {
  constructor(data) {
    super(data);

    this._weaponType = data.weaponType;
    this._physicalDamage = data.physicalDamage;
  }

  getWeaponType() {
    return this._weaponType;
  }

  getPhysicalDamage() {
    return this._physicalDamage;
  }
}

module.exports = ItemWeapon;