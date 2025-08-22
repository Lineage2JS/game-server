const ServerPacket = require('./ServerPacket.js'); 

class MoveToLocation {
  constructor(positions, objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x01)
      .writeD(objectId)
      .writeD(positions.target.x)
      .writeD(positions.target.y)
      .writeD(positions.target.z)
      .writeD(positions.origin.x)
      .writeD(positions.origin.y)
      .writeD(positions.origin.z)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = MoveToLocation;