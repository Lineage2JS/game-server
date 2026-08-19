const ServerPacket = require('./ServerPacket.js');

class ActionFailed extends ServerPacket {
  constructor() {
    super();
    this
      .writeC(0x35);
  }
}

module.exports = ActionFailed;