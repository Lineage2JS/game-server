const ServerPacket = require('./ServerPacket.js');

class VehicleInfo {
  constructor(boat) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x6E)
      .writeD(boat.objectId)
      .writeD(boat.x)
      .writeD(boat.y)
      .writeD(boat.z)
      .writeD(boat.heading);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = VehicleInfo;