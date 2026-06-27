const ServerPacket = require('./ServerPacket.js');

class SetupGauge {
  /**
   * @param {number} color
   * @param {number} time
   */
  constructor(color, time) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x85)
      .writeD(color)
      .writeD(time)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SetupGauge;