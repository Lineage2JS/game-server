const ServerPacket = require('./ServerPacket.js'); 

class QuestList {
  constructor(quests = []) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x98)
      .writeH(quests.length);

    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i];

      this._packet.writeD(quest.id)
        .writeD(quest.numberState);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = QuestList;