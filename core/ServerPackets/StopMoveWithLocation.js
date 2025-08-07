const ServerPacket = require('./ServerPacket.js'); 

class StopMoveWithLocation {
  constructor(character) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x5F)
      .writeD(character.objectId)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StopMoveWithLocation;