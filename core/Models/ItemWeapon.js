const Item = require('./Item');

class ItemWeapon extends Item {
  constructor(data) {
    super(data);

    this._weaponType = data.weaponType;
    this._physicalDamage = data.physicalDamage;
    this._attackSpeed = data.attackSpeed;
  }

  getWeaponType() {
    return this._weaponType;
  }

  getPhysicalDamage() {
    return this._physicalDamage;
  }

  getAttackSpeed() {
    return this._attackSpeed;
  }
}

module.exports = ItemWeapon;