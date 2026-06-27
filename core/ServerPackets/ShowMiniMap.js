const ServerPacket = require('./ServerPacket.js');

class ShowMiniMap {
  /**
   * @param {number} mapId
   */
  constructor(mapId) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0xB6)
      .writeD(mapId)
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ShowMiniMap;