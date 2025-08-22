const ServerPacket = require('./ServerPacket.js'); 

class SunRise {
  constructor() {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x28);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SunRise;