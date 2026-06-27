const ServerPacket = require('./ServerPacket.js');

class AutoAttackStop {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x3C)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AutoAttackStop;