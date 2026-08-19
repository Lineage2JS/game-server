const ServerPacket = require('./ServerPacket.js');

class CharacterDeleteOk extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x33);
  }
}

module.exports = CharacterDeleteOk;