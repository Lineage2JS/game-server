const ServerPacket = require('./ServerPacket.js');

class StatusUpdate extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {Array<{id: number, value: number}>} attributes
   */
  constructor(objectId, attributes) {
    super();
    this
      .writeC(0x1A)
      .writeD(objectId)
      .writeD(attributes.length)

    for(let i = 0; i < attributes.length; i++) {
      this
        .writeD(attributes[i].id)
        .writeD(attributes[i].value);
    }
  }
}

module.exports = StatusUpdate;