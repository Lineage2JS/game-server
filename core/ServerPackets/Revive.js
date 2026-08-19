const ServerPacket = require('./ServerPacket.js');

class Revive extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0x0C)
      .writeD(objectId);
  }
}

module.exports = Revive;