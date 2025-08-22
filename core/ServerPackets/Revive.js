const ServerPacket = require('./ServerPacket.js'); 

class Revive {
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x0C)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Revive;