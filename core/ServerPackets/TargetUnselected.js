const ServerPacket = require('./ServerPacket');

class TargetUnselected extends ServerPacket {
  /**
   * @param {import('../Models/Player.js')} player
   */
  constructor(player) {
    super();
    this
      .writeC(0x3A)
      .writeD(player.objectId)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeD(player.target);
  }
}

module.exports = TargetUnselected;