const ServerPacket = require('./ServerPacket.js');

class RestartResponse extends ServerPacket {
  /**
   * @param {boolean} allowRestart
   */
  constructor(allowRestart) {
    super();
    this
      .writeC(0x74)
      .writeD(allowRestart ? 0x01 : 0x00);
  }
}

module.exports = RestartResponse;