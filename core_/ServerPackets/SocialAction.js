const ServerPacket = require('./ServerPacket.js'); 

class SocialAction {
  constructor(objectId, actionId) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x3D)
      .writeD(objectId)
      .writeD(actionId);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SocialAction;