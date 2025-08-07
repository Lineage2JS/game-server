const ServerPacket = require('./ServerPacket.js'); 

class SpawnItem {
  constructor(item) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x15)
      .writeD(item.objectId)
      .writeD(item.itemId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z)
      .writeD(0) // stackable
      .writeD(1) // count
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SpawnItem;