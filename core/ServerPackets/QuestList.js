const ServerPacket = require('./ServerPacket.js');

class QuestList extends ServerPacket {
  /**
   * @param {import('../Systems/Quests.js').Quest[]} quests
   */
  constructor(quests = []) {
    super();
    this
      .writeC(0x98)
      .writeH(quests.length);

    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i];

      this.writeD(quest.id)
        .writeD(quest.numberState);
    }
  }
}

module.exports = QuestList;