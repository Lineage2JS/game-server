const ServerPacket = require('./ServerPacket.js'); 

class PlaySound {
  constructor(soundName) {
    this._packet = new ServerPacket();
    this._packet.writeC(0xB1)
      .writeD(0)
      .writeS(soundName)
      .writeD(0)
      .writeD(0)
      .writeD(0)
      .writeD(0)
      .writeD(0)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = PlaySound;