const ServerPacket = require('./ServerPacket.js');

class VehicleInfo extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} boat
   */
  constructor(boat) {
    super();
    this
      .writeC(0x6E)
      .writeD(boat.objectId)
      .writeD(boat.x)
      .writeD(boat.y)
      .writeD(boat.z)
      .writeD(boat.heading);
  }
}

module.exports = VehicleInfo;