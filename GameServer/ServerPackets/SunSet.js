const ServerPacket = require('./ServerPacket.js'); 

class SunSet {
  constructor() {
    this._packet = new ServerPacket(1);
    this._packet.writeC(0x29);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SunSet;