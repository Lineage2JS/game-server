const ServerPacket = require('./ServerPacket.js');

class AbnormalStatusUpdate extends ServerPacket {
  /**
   * @param {*[]} effects
   */
  constructor(effects) {
    super();

    this
      .writeC(0x97)
      .writeH(effects.length);

    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];

      this
        .writeD(effect.skillId)
        .writeH(effect.level)
        .writeD(effect.duration);
    }
  }
}

module.exports = AbnormalStatusUpdate;