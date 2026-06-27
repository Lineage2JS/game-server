const ServerPacket = require('./ServerPacket.js');

class StartRotating {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {number} degree
   * @param {number} side
   */
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