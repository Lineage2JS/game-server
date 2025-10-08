const Item = require('./Item');

class ItemArmor extends Item {
  constructor(data) {
    super(data);

    this._armorType = data.armorType;
  }

  getArmorType() {
    return this._armorType;
  }
}

module.exports = ItemArmor;