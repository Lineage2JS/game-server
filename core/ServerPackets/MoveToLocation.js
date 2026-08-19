const ServerPacket = require('./ServerPacket.js');

class MoveToLocation extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {number} targetX
   * @param {number} targetY
   * @param {number} targetZ
   * @param {number} originX
   * @param {number} originY
   * @param {number} originZ
   */
  constructor(objectId, targetX, targetY, targetZ, originX, originY, originZ) {
    super();
    this
      .writeC(0x01)
      .writeD(objectId)
      .writeD(targetX)
      .writeD(targetY)
      .writeD(targetZ)
      .writeD(originX)
      .writeD(originY)
      .writeD(originZ)
  }
}

module.exports = MoveToLocation;