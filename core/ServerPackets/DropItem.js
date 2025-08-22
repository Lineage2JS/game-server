const ServerPacket = require('./ServerPacket.js'); 

class DropItem {
  constructor(character, item) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x16)
      .writeD(character.objectId)
      .writeD(item.objectId)
      .writeD(item.itemId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z)
      .writeD(0) // stackable
      .writeD(1) // count
      .writeD(1) // unknow
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = DropItem;