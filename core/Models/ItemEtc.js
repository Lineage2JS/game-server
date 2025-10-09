const Item = require('./Item');

class ItemEtc extends Item {
  constructor(data) {
    super(data);

    this._etcItemType = data.etcItemType;
    this._stackable = data.stackable;
  }

  getEtcItemType() {
    return this._etcItemType;
  }

  getStackable() {
    return this._stackable;
  }

  get isStackable() {
    return this._stackable;
  }
}

module.exports = ItemEtc;