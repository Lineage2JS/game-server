const ServerPacket = require('./ServerPacket.js');

class PlaySound extends ServerPacket {
  /**
   * @param {string} soundName
   */
  constructor(soundName) {
    super();
    this
      .writeC(0xB1)
      .writeD(0)
      .writeS(soundName)
      .writeD(0)
      .writeD(0)
      .writeD(0)
      .writeD(0)
      .writeD(0)
  }
}

module.exports = PlaySound;