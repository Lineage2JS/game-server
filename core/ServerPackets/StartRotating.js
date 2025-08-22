const ServerPacket = require('./ServerPacket.js'); 

class StartRotating {
  constructor(character, degree, side) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x77)
      .writeD(character.objectId)
      .writeD(degree)
      .writeD(side)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StartRotating;