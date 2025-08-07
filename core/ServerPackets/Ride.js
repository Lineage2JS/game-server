const ServerPacket = require('./ServerPacket.js'); 

class Ride {
  constructor(character, typePet) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x9F)
      .writeD(character.objectId)
      .writeD(1) // 1 for mount ; 2 for dismount
      .writeD(typePet) // 1 for Strider ; 2 for wyvern
      .writeD(12621 + 1000000) // NPC ID
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Ride;