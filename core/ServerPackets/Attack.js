const ServerPacket = require('./ServerPacket.js');

class Attack extends ServerPacket {
  /**
   * @param {import('../Models/Player.js')} player
   * @param {number} targetObjectId
   * @param {boolean} soulshot
   */
  constructor(player, targetObjectId, soulshot = false) {
    super();
    this
      .writeC(0x06)
      .writeD(player.objectId)
      .writeD(targetObjectId)
      .writeD(1) // damage
      .writeC(soulshot ? 0x16 : 0x00) // 0 | 0x10
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeH(0);
  }
}

module.exports = Attack;