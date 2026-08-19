const ServerPacket = require('./ServerPacket.js');

class SocialAction extends ServerPacket {
  /**
   * @param {number} objectId
   * @param {number} actionId
   */
  constructor(objectId, actionId) {
    super();
    this
      .writeC(0x3D)
      .writeD(objectId)
      .writeD(actionId);
  }
}

module.exports = SocialAction;