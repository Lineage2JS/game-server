const ServerPacket = require('./ServerPacket.js'); 

class CharacterCreateSuccess {
  constructor() {
    this._packet = new ServerPacket();
    this._packet.writeC(0x25)
      .writeD(0x01);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CharacterCreateSuccess;