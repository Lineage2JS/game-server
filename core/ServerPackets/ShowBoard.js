const ServerPacket = require('./ServerPacket.js');

class ShowBoard extends ServerPacket {
  /**
   * @param {string} html
   */
  constructor(html) {
    super();
    this
      .writeC(0x86)
      .writeS("") // top
      .writeS("")
      .writeS("")
      .writeS("")
      .writeS("")
      .writeS("")
      .writeS(html);
  }
}

module.exports = ShowBoard;