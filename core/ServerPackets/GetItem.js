const ServerPacket = require('./ServerPacket.js'); 

class GetItem {
  constructor(character, item) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x17)
      .writeD(character.objectId)
      .writeD(item.objectId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = GetItem;