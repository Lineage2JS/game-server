const ServerPacket = require('./ServerPacket');

class TargetSelected extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {number} color
   */
  constructor(objectId, color = 0) {
    super();
    this
      .writeC(0xBF)
      .writeD(objectId)
      .writeH(color);
  }
}

module.exports = TargetSelected;