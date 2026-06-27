const ServerPacket = require('./ServerPacket.js');

class Die extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0x0B)
      .writeD(objectId)
      .writeD(1) // to nearest village // TODO
      .writeD(0) // to hide away
      .writeD(0) // to castle
      .writeD(0) // to siege HQ
      .writeD(0) // sweepable (blue glow, spoil)
      .writeD(0) // fixed(stand now) for GM
  }
}

module.exports = Die;