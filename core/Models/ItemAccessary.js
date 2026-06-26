const Item = require('./Item');

class ItemAccessary extends Item {
  /**
   * @param {{ itemId: number, name: string, bodyPart: number, type1: number, type2: number, weight: number, price: number, stackable?: boolean }} data
   */
  constructor(data) {
    super(data);
  }
}

module.exports = ItemAccessary;