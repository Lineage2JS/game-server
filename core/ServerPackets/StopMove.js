const ServerPacket = require('./ServerPacket.js');

class StopMove extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(objectId, x, y, z) {
    super();
    this
      .writeC(0x59)
      .writeD(objectId)
      .writeD(x)
      .writeD(y)
      .writeD(z)
      .writeD(0);
  }
}

module.exports = StopMove;