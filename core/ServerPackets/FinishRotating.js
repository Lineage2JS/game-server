const ServerPacket = require('./ServerPacket.js'); 

class FinishRotating {
  constructor(character, degree) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x78)
      .writeD(character.objectId)
      .writeD(degree);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = FinishRotating;