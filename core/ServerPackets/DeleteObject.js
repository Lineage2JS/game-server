const ServerPacket = require('./ServerPacket.js'); 

class DeleteObject {
  constructor(objectId) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x1E)
      .writeD(objectId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = DeleteObject;