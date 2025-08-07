const ServerPacket = require('./ServerPacket'); 

class TargetSelected {
  constructor(objectId, color = 0) {
    this._packet = new ServerPacket();
    this._packet.writeC(0xBF)
      .writeD(objectId)
      .writeH(color);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TargetSelected;