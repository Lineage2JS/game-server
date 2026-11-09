const ServerPacket = require('./ServerPacket'); 

class NetPing {
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0xEC)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = NetPing;