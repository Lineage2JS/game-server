const ServerPacket = require('./ServerPacket.js');

class DeleteObject extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0x1E)
      .writeD(objectId);
  }
}

module.exports = DeleteObject;