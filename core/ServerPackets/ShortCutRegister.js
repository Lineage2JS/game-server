const ServerPacket = require('./ServerPacket.js');

class ShortCutRegister extends ServerPacket {
  /**
   * @param {number} slot
   * @param {number} type
   * @param {number} typeId
   * @param {number} level
   * @param {number} dat2
   */
  constructor(slot, type, typeId, level, dat2) {
    super();
    this
      .writeC(0x56)
      .writeD(type)
      .writeD(slot)
      .writeD(typeId);

    if (level > -1) {
      this.writeD(level);
    }

    this.writeD(dat2);
  }
}

module.exports = ShortCutRegister;