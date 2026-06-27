const ServerPacket = require('./ServerPacket.js');

class TeleportToLocation extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(objectId, x, y, z) {
    super();
    this
      .writeC(0x38)
      .writeD(objectId)
      .writeD(x)
      .writeD(y)
      .writeD(z);
  }
}

module.exports = TeleportToLocation;