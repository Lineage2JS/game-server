const ServerPacket = require('./ServerPacket.js');

class ShowRadar {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x, y, z) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0xBD)
      .writeD(x)
      .writeD(y)
      .writeD(z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ShowRadar;