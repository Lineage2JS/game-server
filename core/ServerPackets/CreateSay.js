const ServerPacket = require('./ServerPacket.js');

class CreateSay extends ServerPacket {
  /**
   * @param {number} characterObjectId
   * @param {string} characterName
   * @param {number} type
   * @param {string} text
   */
  constructor(characterObjectId, characterName, type, text) {
    super();
    this
      .writeC(0x5D)
      .writeD(characterObjectId)
      .writeD(type)
      .writeS(characterName)
      .writeS(text);
  }
}

module.exports = CreateSay;