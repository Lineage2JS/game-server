const ServerPacket = require('./ServerPacket.js');

class Ride extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {number} typePet
   */
  constructor(character, typePet) {
    super();
    this
      .writeC(0x9F)
      .writeD(character.objectId)
      .writeD(1) // 1 for mount ; 2 for dismount
      .writeD(typePet) // 1 for Strider ; 2 for wyvern
      .writeD(12621 + 1000000) // NPC ID
  }
}

module.exports = Ride;