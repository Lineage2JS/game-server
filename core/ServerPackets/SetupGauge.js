const ServerPacket = require('./ServerPacket.js');

class SetupGauge extends ServerPacket {
  /**
   * @param {number} color
   * @param {number} time
   */
  constructor(color, time) {
    super();
    this
      .writeC(0x85)
      .writeD(color)
      .writeD(time)
  }
}

module.exports = SetupGauge;