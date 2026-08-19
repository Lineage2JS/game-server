const ServerPacket = require('./ServerPacket.js');

class NpcHtmlMessage extends ServerPacket {
  /**
   * @param {string} html
   */
  constructor(html) {
    super();
    this
      .writeC(0x1B)
      .writeD(1) // messageId
      .writeS(html);
  }
}

module.exports = NpcHtmlMessage;