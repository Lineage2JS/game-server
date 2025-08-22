const ServerPacket = require('./ServerPacket.js'); 

class AbnormalStatusUpdate {
  constructor(effects) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x97)
      .writeH(effects.length);

    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];

      this._packet
        .writeD(effect.skillId)
        .writeH(effect.level)
        .writeD(effect.duration);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AbnormalStatusUpdate;