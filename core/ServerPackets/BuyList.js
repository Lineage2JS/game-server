const ServerPacket = require('./ServerPacket.js');

class BuyList {
  constructor(adenaCount, items) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x1D)
      .writeD(adenaCount)
      .writeD(8) // buyListId ?
      .writeH(items.length);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      this._packet
        .writeH(item.getType1())
        .writeD(item.getObjectId())
        .writeD(item.getItemId())
        .writeD(item.getCount())
        .writeH(item.getType2())
        .writeH(0); // TODO ?
      
      if (item.getType1() < 4) { // TODO
        this._packet.writeD(item.getBodyPart())
        .writeH(0) // enchant level
        .writeH(0) // TODO ?
        .writeH(0); // TODO ?
      }

      this._packet.writeD(item.getPrice())
    } 
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = BuyList;