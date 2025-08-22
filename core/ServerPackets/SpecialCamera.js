const ServerPacket = require('./ServerPacket.js'); 

class SpecialCamera {
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0xE0)
      .writeD(objectId)
      .writeD(50)
      .writeD(0)
      .writeD(0)
      .writeD(1)
      .writeD(5000)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(1)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SpecialCamera;