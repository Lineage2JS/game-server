const ServerPacket = require('./ServerPacket.js');

class TutorialShowHtml {
  /**
   * @param {string} htmlMessage
   */
  constructor(htmlMessage) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0xB9)
      .writeS(htmlMessage);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TutorialShowHtml;