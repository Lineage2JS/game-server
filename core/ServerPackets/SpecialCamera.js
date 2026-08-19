const ServerPacket = require('./ServerPacket.js');

class SpecialCamera extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0xE0)
      .writeD(objectId)
      .writeD(50)
      .writeD(0)
      .writeD(0)
      .writeD(1)
      .writeD(5000)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(1)
      .writeD(1)
  }
}

module.exports = SpecialCamera;