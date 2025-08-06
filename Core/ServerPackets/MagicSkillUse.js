const ServerPacket = require('./ServerPacket.js'); 

class MagicSkillUse {
  constructor(character, skill) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x5A)
      .writeD(character.objectId)
      .writeD(character.target)
      .writeD(skill.id)
      .writeD(skill.level)
      .writeD(skill.hitTime)
      .writeD(skill.reuseDelay)
      .writeD(character.x)
      .writeD(character.y)
      .writeD(character.z)
      .writeH(0x00);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = MagicSkillUse;