const ServerPacket = require('./ServerPacket.js');

class MoveToLocation {
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
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x01)
      .writeD(objectId)
      .writeD(targetX)
      .writeD(targetY)
      .writeD(targetZ)
      .writeD(originX)
      .writeD(originY)
      .writeD(originZ)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = MoveToLocation;