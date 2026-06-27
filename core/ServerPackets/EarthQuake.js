const ServerPacket = require('./ServerPacket.js');

class EarthQuake extends ServerPacket {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} intensity
   * @param {number} duration
   */
  constructor(x, y, z, intensity, duration) {
    super();
    this
      .writeC(0xDD)
      .writeD(x)
      .writeD(y)
      .writeD(z)
      .writeD(intensity)
      .writeD(duration)
      .writeD(0x00) // Unknow
  }
}

module.exports = EarthQuake;