const ServerPacket = require('./ServerPacket.js');

class AutoAttackStart extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0x3B)
      .writeD(objectId);
  }
}

module.exports = AutoAttackStart;