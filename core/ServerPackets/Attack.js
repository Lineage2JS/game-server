const ServerPacket = require('./ServerPacket.js'); 

class Attack {
  constructor(player, targetObjectId, soulshot = false) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x06)
      .writeD(player.objectId)
      .writeD(targetObjectId)
      .writeD(1) // damage

      .writeC(soulshot ? 0x16 : 0x00) // 0 | 0x10
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeH(0);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = Attack;