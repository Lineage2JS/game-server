const ServerPacket = require('./ServerPacket.js'); 

class ShowTutorialMark {
  constructor(blink) {
    this._packet = new ServerPacket();
    this._packet.writeC(0xBA)
      .writeD(blink);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ShowTutorialMark;