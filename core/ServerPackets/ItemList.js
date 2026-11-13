const ServerPacket = require('./ServerPacket');

class ItemList {
  constructor(items, showWindow = false) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x27)
      .writeH(showWindow ? 0x01 : 0x00)
      .writeH(items.length)

    for(let i = 0; i < items.length; i++) {
      const item = items[i];

      this._packet
        .writeH(item.getType1())
        .writeD(item.getObjectId())
        .writeD(item.getItemId())
        .writeD(item.getCount())
        .writeH(item.getType2());
      
      this._packet.writeH(0xff); // TODO

      if (item.isEquipped) { // TODO
        this._packet.writeH(0x01);
      } else {
        this._packet.writeH(0x00);
      }
      
      this._packet
        .writeD(item.getBodyPart())
        .writeH(0x00) // getEnchantLevel
        .writeH(0x00); // TODO
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ItemList;