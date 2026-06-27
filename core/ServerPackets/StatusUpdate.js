const ServerPacket = require('./ServerPacket.js');

class StatusUpdate {
  /**
   * @param {number} objectId
   * @param {Array<{id: number, value: number}>} attributes
   */
  constructor(objectId, attributes) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x1A)
      .writeD(objectId)
      .writeD(attributes.length)

    for(let i = 0; i < attributes.length; i++) {
      this._packet.writeD(attributes[i].id)
        .writeD(attributes[i].value);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StatusUpdate;