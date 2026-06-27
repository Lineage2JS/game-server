const ServerPacket = require('./ServerPacket.js');

class SunRise extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x28);
  }
}

module.exports = SunRise;