const ServerPacket = require('./ServerPacket.js');

class AcquireSkillDone extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0xA7);
  }
}

module.exports = AcquireSkillDone;