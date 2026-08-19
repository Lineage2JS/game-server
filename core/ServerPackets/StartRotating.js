const ServerPacket = require('./ServerPacket.js');

class StartRotating extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {number} degree
   * @param {number} side
   */
  constructor(character, degree, side) {
    super();
    this
      .writeC(0x77)
      .writeD(character.objectId)
      .writeD(degree)
      .writeD(side)
  }
}

module.exports = StartRotating;