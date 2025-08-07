const ServerPacket = require('./ServerPacket.js'); 

class SetupGauge {
  constructor(color, time) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x85)
      .writeD(color)
      .writeD(time)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SetupGauge;