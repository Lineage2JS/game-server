const ServerPacket = require('./ServerPacket.js');

class CharacterCreateSuccess extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x25)
      .writeD(0x01);
  }
}

module.exports = CharacterCreateSuccess;