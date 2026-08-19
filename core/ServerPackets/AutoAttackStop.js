const ServerPacket = require('./ServerPacket.js');

class AutoAttackStop extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0x3C)
      .writeD(objectId);
  }
}

module.exports = AutoAttackStop;