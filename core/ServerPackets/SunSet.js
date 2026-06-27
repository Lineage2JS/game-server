const ServerPacket = require('./ServerPacket.js');

class SunSet extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x29);
  }
}

module.exports = SunSet;