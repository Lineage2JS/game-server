const ServerPacket = require('./ServerPacket.js'); 

class CreateSay {
  constructor(character, type, text) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x5D)
      .writeD(character.objectId)
      .writeD(type)
      .writeS(character.characterName)
      .writeS(text);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CreateSay;