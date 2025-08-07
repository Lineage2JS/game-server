const ServerPacket = require('./ServerPacket.js'); 

class ActionFailed {
  constructor() {
    this._packet = new ServerPacket();
    this._packet.writeC(0x35);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ActionFailed;