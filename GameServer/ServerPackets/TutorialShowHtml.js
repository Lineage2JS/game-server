const ServerPacket = require('./ServerPacket.js'); 

class TutorialShowHtml {
  constructor(htmlMessage) {
    this._packet = new ServerPacket(1 + ServerPacket.strlen(htmlMessage));
    this._packet.writeC(0xB9)
      .writeS(htmlMessage);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TutorialShowHtml;