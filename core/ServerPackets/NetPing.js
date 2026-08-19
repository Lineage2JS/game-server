const ServerPacket = require('./ServerPacket.js');

class NetPing extends ServerPacket {
  /**
   * @param {number} objectId
   */
  constructor(objectId) {
    super();
    this
      .writeC(0xEC)
      .writeD(objectId);
  }
}

module.exports = NetPing;