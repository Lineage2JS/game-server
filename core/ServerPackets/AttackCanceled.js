const ServerPacket = require('./ServerPacket.js');

class AttackCanceled extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   */
  constructor(character) {
    super();
    this
      .writeC(0x0A)
      .writeD(character.objectId);
  }
}

module.exports = AttackCanceled;