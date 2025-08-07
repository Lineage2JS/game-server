const ServerPacket = require('./ServerPacket.js'); 

class AttackCanceled {
  constructor(character) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x0A)
      .writeD(character.objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AttackCanceled;