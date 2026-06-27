const Item = require('./Item');

class ItemArmor extends Item {
  /**
   * @param {import ('./Item').ItemData & { armorType: string }} data
   */
  constructor(data) {
    super(data);

    /** @type {string} */
    this._armorType = data.armorType;
  }

  /** @returns {string} */
  getArmorType() {
    return this._armorType;
  }
}

module.exports = ItemArmor;