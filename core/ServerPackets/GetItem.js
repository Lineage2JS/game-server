const ServerPacket = require('./ServerPacket.js');

class GetItem extends ServerPacket {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {*} item
   */
  constructor(character, item) {
    super();
    this
      .writeC(0x17)
      .writeD(character.objectId)
      .writeD(item.objectId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z);
  }
}

module.exports = GetItem;