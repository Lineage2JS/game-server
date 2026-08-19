const ServerPacket = require('./ServerPacket.js');

class CharacterCreateFail extends ServerPacket {
  /**
   * @param {number} reason
   */
  constructor(reason) {
    super();
    this
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
}

module.exports = CharacterCreateFail;