const ServerPacket = require('./ServerPacket.js'); 

class Die {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x0B)
      .writeD(objectId)
      .writeD(1) // to nearest village // TODO
      .writeD(0) // to hide away
      .writeD(0) // to castle
      .writeD(0) // to siege HQ
      .writeD(0) // sweepable (blue glow, spoil)
      .writeD(0) // fixed(stand now) for GM
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Die;