const ServerPacket = require('./ServerPacket.js');

class MoveToPawn extends ServerPacket {
  /**
   * @param {import('../Models/Player.js')} player
   * @param {import('../Models/Character.js')} target
   * @param {number} distance
   */
  constructor(player, target, distance) {
    super();
    this
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
}

module.exports = MoveToPawn;