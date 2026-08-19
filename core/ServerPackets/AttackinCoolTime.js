const ServerPacket = require('./ServerPacket.js');

class AttackinCoolTime extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x0E);
  }
}

module.exports = AttackinCoolTime;