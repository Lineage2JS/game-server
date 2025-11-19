const Item = require('./Item');

class ItemAsset extends Item {
  constructor(data) {
    super(data);

    this._etcItemType = data.etcItemType;
  }

  getEtcItemType() {
    return this._etcItemType;
  }
}

module.exports = ItemAsset;