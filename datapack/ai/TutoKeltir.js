const DefaultNpc = require('./DefaultNpc');

class TutoKeltir extends DefaultNpc {
  onMyDying(talker) {
    const quests = talker.getQuests();
    const quest = quests.find(quest => quest.id === 201);

    if (quest) {
      this.giveItem(talker, 'fox_fang1', 1);
      this.soundEffect(talker, 'ItemSound.quest_itemget');
    }
  }
}

module.exports = TutoKeltir;