const ServerPacket = require('./ServerPacket.js'); 

class TeleportToLocation {
  constructor(objectId, x, y, z) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x38)
      .writeD(objectId)
      .writeD(x)
      .writeD(y)
      .writeD(z);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TeleportToLocation;