const ServerPacket = require('./ServerPacket.js');

class ShowRadar extends ServerPacket {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x, y, z) {
    super();
    this
      .writeC(0xBD)
      .writeD(x)
      .writeD(y)
      .writeD(z);
  }
}

module.exports = ShowRadar;