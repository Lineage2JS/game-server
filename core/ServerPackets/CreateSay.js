const ServerPacket = require('./ServerPacket.js'); 

class CreateSay {
  constructor(characterObjectId, characterName, type, text) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x5D)
      .writeD(characterObjectId)
      .writeD(type)
      .writeS(characterName)
      .writeS(text);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CreateSay;