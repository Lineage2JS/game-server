const ServerPacket = require('./ServerPacket.js');

class AuthLoginFail {
  /**
   * @param {number} reason
   */
  constructor(reason) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x12)
      .writeC(reason);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AuthLoginFail;