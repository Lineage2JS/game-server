const Item = require('./Item');

class ItemWeapon extends Item {
  /**
   * @param {import ('./Item').ItemData & { weaponType: string }} data
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