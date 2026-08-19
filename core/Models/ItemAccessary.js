const Item = require('./Item');

class ItemAccessary extends Item {
  /**
   * @param {import ('./Item').ItemData} data
   */
  constructor(data) {
    super(data);
  }
}

module.exports = ItemAccessary;