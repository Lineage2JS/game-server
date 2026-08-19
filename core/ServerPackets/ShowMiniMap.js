const ServerPacket = require('./ServerPacket.js');

class ShowMiniMap extends ServerPacket {
  /**
   * @param {number} mapId
   */
  constructor(mapId) {
    super();
    this
      .writeC(0xB6)
      .writeD(mapId)
  }
}

module.exports = ShowMiniMap;