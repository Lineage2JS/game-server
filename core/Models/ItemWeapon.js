const Item = require('./Item');

class ItemWeapon extends Item {
  /**
   * @param {{ itemId: number, name: string, bodyPart: number, type1: number, type2: number, weight: number, price: number, stackable?: boolean, weaponType: string }} data
   */
  constructor(data) {
    super(data);

    /** @type {string} */
    this._weaponType = data.weaponType;
  }

  /** @returns {string} */
  getWeaponType() {
    return this._weaponType;
  }
}

module.exports = ItemWeapon;