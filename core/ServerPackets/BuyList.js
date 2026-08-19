const ServerPacket = require('./ServerPacket.js');

class BuyList extends ServerPacket {
  /**
   * @param {number} adenaCount
   * @param {import('../Models/Item.js')[]} items
   */
  constructor(adenaCount, items) {
    super();
    this
      .writeC(0x1D)
      .writeD(adenaCount)
      .writeD(8) // buyListId ?
      .writeH(items.length);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      this
        .writeH(item.getType1())
        .writeD(item.getObjectId())
        .writeD(item.getItemId())
        .writeD(item.getCount())
        .writeH(item.getType2())
        .writeH(0); // TODO ?

      if (item.getType1() < 4) { // TODO
        this.writeD(item.getBodyPart())
        .writeH(0) // enchant level
        .writeH(0) // TODO ?
        .writeH(0); // TODO ?
      }

      this.writeD(item.getPrice())
    }
  }
}

module.exports = BuyList;