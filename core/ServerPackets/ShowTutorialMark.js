const ServerPacket = require('./ServerPacket.js');

class ShowTutorialMark extends ServerPacket {
  /**
   * @param {number} blink
   */
  constructor(blink) {
    super();
    this
      .writeC(0xBA)
      .writeD(blink);
  }
}

module.exports = ShowTutorialMark;