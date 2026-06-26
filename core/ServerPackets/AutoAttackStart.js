const ServerPacket = require('./ServerPacket.js');

class AutoAttackStart {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x3B)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AutoAttackStart;