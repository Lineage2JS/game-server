const Item = require('./Item');

class ItemAsset extends Item {
  /**
   * @param {import ('./Item').ItemData & { etcItemType: number }} data
   */
  constructor(data) {
    super(data);

    /** @type {number} */
    this._etcItemType = data.etcItemType;
  }

  /** @returns {number} */
  getEtcItemType() {
    return this._etcItemType;
  }
}

module.exports = ItemAsset;