const npcEventBus = require('./../../core/Events/NpcEventBus');

class DefaultNpc {
  constructor() {
    this.npcEventBus = npcEventBus;
  }

  showPage(talker, htmlFileName) {
    this.npcEventBus.emit('showPage', talker, htmlFileName);
  }

  setMemo(talker, memo) {
    this.npcEventBus.emit('setMemo', talker, memo);
  }

  haveMemo(talker, memo) {
    const quests = talker.getQuests();
    const quest = quests.find(quest => quest.id === memo);

    if (quest) {
      return 1;
    } else {
      return 0;
    }
  }

  ownItemCount(talker, itemName) {
    const items = talker.getItems();
    const item = items.find(item => item.itemName === itemName);

    if (item) {
      return item.getCount();
    } else {
      return 0;
    }
  }

  getOneTimeQuestFlag(talker, questId) {
    const quests = talker.getQuests();
    const quest = quests.find(quest => quest.id === questId);

    if (quest && quest.isCompleted) {
      return 1;
    } else {
      return 0;
    }
  }

  showQuestionMark(talker, questionMarkId) {
    this.npcEventBus.emit('showQuestionMark', talker, questionMarkId);
  }

  showRadar(talker, x, y, z) {
    this.npcEventBus.emit('showRadar', talker, x, y, z);
  }

  soundEffect(talker, soundName) {
    this.npcEventBus.emit('soundEffect', talker, soundName);
  }

  giveItem(talker, itemName, itemCount) {
    this.npcEventBus.emit('giveItem', talker, itemName, itemCount);
  }

  deleteItem(talker, itemName, itemCount) {
    this.npcEventBus.emit('deleteItem', talker, itemName, itemCount);
  }

  sell(talker, sellList, shopName, fnBuy) {
    this.npcEventBus.emit('sell', talker, sellList, shopName, fnBuy);
  }

  addFleeDesire(attacker) {    
    this._npc.updateState('stop');
    // fix
    const positions = this._npc._getRandomPos(this._npc.coordinates);

    let path = {
      target: {
        x: positions[0],
        y: positions[1],
        z: -3115
      },
      origin: {
        x: this._npc.x,
        y: this._npc.y,
        z: this._npc.z
      }
    }

    this._npc.job = 'patrol';
    this._npc.updateState('move', path);

    console.log(this._npc);
    //
  }

  showSkillList(talker) {
    this.npcEventBus.emit('showSkillList', talker);
  }
}

module.exports = DefaultNpc;