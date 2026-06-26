const Item = require('./Item');

class ItemArmor extends Item {
  /**
   * @param {{ itemId: number, name: string, bodyPart: number, type1: number, type2: number, weight: number, price: number, stackable?: boolean, armorType: string }} data
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