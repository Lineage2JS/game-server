const ServerPacket = require('./ServerPacket.js');

class AuthLoginFail extends ServerPacket {
  /**
   * @param {number} reason
   */
  constructor(reason) {
    super();
    this
      .writeC(0x12)
      .writeC(reason);
  }
}

module.exports = AuthLoginFail;