const ServerPacket = require('./ServerPacket.js'); 

class RestartResponse {
  constructor(allowRestart) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x74)
      .writeD(allowRestart ? 0x01 : 0x00);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = RestartResponse;