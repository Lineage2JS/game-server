const ServerPacket = require('./ServerPacket.js'); 

class MoveToPawn {
  constructor(player, target, distance) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x75)
      .writeD(player.objectId)
      .writeD(target.objectId)
      .writeD(distance)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeD(target.x)
      .writeD(target.y)
      .writeD(target.z)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = MoveToPawn;