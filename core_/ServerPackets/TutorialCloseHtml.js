const ServerPacket = require('./ServerPacket.js'); 

class TutorialCloseHtml {
  constructor() {
    this._packet = new ServerPacket();
    this._packet.writeC(0xBC);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TutorialCloseHtml;