const ServerPacket = require('./ServerPacket.js'); 

class ShortCutRegister {
  constructor(slot, type, typeId, level, dat2) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x56)
      .writeD(type)
      .writeD(slot)
      .writeD(typeId);

    if (level > -1) {
      this._packet.writeD(level);
    }
    
    this._packet.writeD(dat2);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ShortCutRegister;