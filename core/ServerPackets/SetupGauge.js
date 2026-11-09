const ServerPacket = require('./ServerPacket'); 

class SetupGauge {
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