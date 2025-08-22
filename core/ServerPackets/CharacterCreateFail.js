const ServerPacket = require('./ServerPacket.js'); 

class CharacterCreateFail {
  constructor(reason) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x26)
      .writeD(reason);
  }

  static get reason() {
    return {
      REASON_TOO_MANY_CHARACTERS: 0x01,
      REASON_NAME_ALREADY_EXISTS: 0x02,
      REASON_16_ENG_CHARS: 0x03,
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CharacterCreateFail;