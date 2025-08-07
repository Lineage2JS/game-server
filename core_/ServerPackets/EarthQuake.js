const ServerPacket = require('./ServerPacket.js'); 

class EarthQuake {
  constructor(x, y, z, intensity, duration) {
    this._packet = new ServerPacket();
    this._packet.writeC(0xDD)
      .writeD(x)
      .writeD(y)
      .writeD(z)
      .writeD(intensity)
      .writeD(duration)
      .writeD(0x00) // Unknow
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = EarthQuake;