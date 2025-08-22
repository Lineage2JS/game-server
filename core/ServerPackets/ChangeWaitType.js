const ServerPacket = require('./ServerPacket.js'); 

class ChangeWaitType {
  constructor(character, waitType) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x3F)
      .writeD(character.objectId)
      .writeD(waitType)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ChangeWaitType;