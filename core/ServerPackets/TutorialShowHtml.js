const ServerPacket = require('./ServerPacket.js');

class TutorialShowHtml extends ServerPacket {
  /**
   * @param {string} htmlMessage
   */
  constructor(htmlMessage) {
    super();
    this
      .writeC(0xB9)
      .writeS(htmlMessage);
  }
}

module.exports = TutorialShowHtml;