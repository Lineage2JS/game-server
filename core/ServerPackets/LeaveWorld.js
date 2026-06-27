const ServerPacket = require('./ServerPacket.js');

class LeaveWorld extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x96);
  }
}

module.exports = LeaveWorld;