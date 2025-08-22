const ServerPacket = require('./ServerPacket.js'); 

class Die {
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x0B)
      .writeD(objectId)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(0)
      .writeD(1)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Die;