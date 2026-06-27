const ServerPacket = require('./ServerPacket.js');

class ChangeWaitType extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {number} waitType
   */
  constructor(character, waitType) {
    super();
    this
      .writeC(0x3F)
      .writeD(character.objectId)
      .writeD(waitType)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z);
  }
}

module.exports = ChangeWaitType;