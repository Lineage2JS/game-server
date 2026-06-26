const Item = require('./Item');

class ItemAsset extends Item {
  /**
   * @param {{ itemId: number, name: string, bodyPart: number, type1: number, type2: number, weight: number, price: number, stackable?: boolean, etcItemType: string }} data
   */
  constructor(data) {
    super(data);

    /** @type {string} */
    this._etcItemType = data.etcItemType;
  }

  /** @returns {string} */
  getEtcItemType() {
    return this._etcItemType;
  }
}

module.exports = ItemAsset;