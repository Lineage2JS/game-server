const ServerPacket = require('./ServerPacket'); 

class TargetUnselected {
  constructor(player) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x3A)
      .writeD(player.objectId)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeD(player.target);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = TargetUnselected;