const ServerPacket = require('./ServerPacket.js'); 

class DropItem {
  /**
   * @param {import('../Models/Character.js')} character
   * @param {*} item
   */
  constructor(character, item) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x16)
      .writeD(character.objectId)
      .writeD(item.objectId)
      .writeD(item.itemId)
      .writeD(item.x)
      .writeD(item.y)
      .writeD(item.z)
      .writeD(item.itemId === 57 ? 1 : 0) // stackable TODO
      .writeD(item.itemCount) // count
      .writeD(1) // unknow
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = DropItem;