const ServerPacket = require('./ServerPacket.js');

class TutorialCloseHtml extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0xBC);
  }
}

module.exports = TutorialCloseHtml;