const ServerPacket = require('./ServerPacket.js'); 

class NpcHtmlMessage {
  constructor(html) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x1B)
      .writeD(1) // messageId
      .writeS(html);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = NpcHtmlMessage;