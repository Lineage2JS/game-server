const ServerPacket = require('./ServerPacket.js');

class StopMoveWithLocation extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   */
  constructor(character) {
    super();
    this
      .writeC(0x5F)
      .writeD(character.objectId)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z);
  }
}

module.exports = StopMoveWithLocation;