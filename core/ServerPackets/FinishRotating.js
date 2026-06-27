const ServerPacket = require('./ServerPacket.js');

class FinishRotating extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {number} degree
   */
  constructor(character, degree) {
    super();
    this
      .writeC(0x78)
      .writeD(character.objectId)
      .writeD(degree);
  }
}

module.exports = FinishRotating;