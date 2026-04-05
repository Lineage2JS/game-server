const ServerPacket = require('./ServerPacket.js'); 

class MoveToLocation {
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