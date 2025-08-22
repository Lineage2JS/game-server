const ServerPacket = require('./ServerPacket.js');

class BuyList {
  constructor(items) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x1D)
      .writeD(1000) // money
      .writeD(8) // buyListId ?
      .writeH(items.length) // items length

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      this._packet
        .writeH(1)
        .writeD(item.objectId)
        .writeD(item.itemId)
        .writeD(1)
        .writeH(1)
        .writeH(0)
        .writeD(0x0080)
        .writeH(0)
        .writeH(0)
        .writeH(0)
        .writeD(10)
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = BuyList;