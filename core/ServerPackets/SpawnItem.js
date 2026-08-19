const ServerPacket = require('./ServerPacket.js');

class SpawnItem extends ServerPacket {
  /**
   * @param {*} item
   */
  constructor(item) {
    super();
    this
      .writeC(0x15)
      .writeD(item.objectId)
      .writeD(item.itemId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z)
      .writeD(0) // stackable
      .writeD(1) // count
  }
}

module.exports = SpawnItem;