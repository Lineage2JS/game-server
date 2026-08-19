const ServerPacket = require('./ServerPacket.js');

class ItemList extends ServerPacket {
  /**
   * @param {import('../Models/Item.js')[]} items
   * @param {boolean} showWindow
   */
  constructor(items, showWindow = false) {
    super();
    this
      .writeC(0x27)
      .writeH(showWindow ? 0x01 : 0x00)
      .writeH(items.length)

    for(let i = 0; i < items.length; i++) {
      const item = items[i];

      this
        .writeH(item.getType1())
        .writeD(item.getObjectId())
        .writeD(item.getItemId())
        .writeD(item.getCount())
        .writeH(item.getType2());

      this.writeH(0xff); // TODO

      if (item.isEquipped) { // TODO
        this.writeH(0x01);
      } else {
        this.writeH(0x00);
      }

      this
        .writeD(item.getBodyPart())
        .writeH(0x00) // getEnchantLevel
        .writeH(0x00); // TODO
    }
  }
}

module.exports = ItemList;