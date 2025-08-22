const ServerPacket = require('./ServerPacket.js'); 

class VersionCheck {
  constructor(isCompliesProtocolVersion, key) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x00)
      .writeC(isCompliesProtocolVersion ? 0x01 : 0x00)
      .writeC(key[0])
      .writeC(key[1])
      .writeC(key[2])
      .writeC(key[3])
      .writeC(key[4])
      .writeC(key[5])
      .writeC(key[6])
      .writeC(key[7]);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = VersionCheck;