const ServerPacket = require('./ServerPacket.js');

class ChangeMoveType extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {number} moveType
   */
  constructor(objectId, moveType) {
    super();
    this
      .writeC(0x3E)
      .writeD(objectId)
      .writeD(moveType);
  }
}

module.exports = ChangeMoveType;