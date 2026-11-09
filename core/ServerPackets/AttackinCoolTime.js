const ServerPacket = require('./ServerPacket'); 

class AttackinCoolTime {
  constructor() {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x0E);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AttackinCoolTime;