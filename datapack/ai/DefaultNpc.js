const npcEventBus = require('./../../core/Events/NpcEventBus');

/** @typedef {import('../../core/Models/Player')} Talker */

class DefaultNpc {
  constructor() {
    this.npcEventBus = npcEventBus;
  }

  /**
   * @param {*} talker
   */
  onTalkSelected(talker) {
    this.showPage(talker, 'noquest.htm');
  }

  /**
   * @param {import('../../core/Models/Player')} talker
   * @param {string} htmlFileName
   */
  showPage(talker, htmlFileName) {
    this.npcEventBus.emit('showPage', talker, htmlFileName);
  }

  /**
   * @param {Talker} talker
   * @param {number} memo
   */
  setMemo(talker, memo) {
    this.npcEventBus.emit('setMemo', talker, memo);
  }

  /**
   * @param {Talker} talker
   * @param {number} memo
   * @returns {0 | 1} boolean
   */
  haveMemo(talker, memo) {
    const quests = talker.getQuests();
    const quest = quests.find(quest => quest.id === memo);

    if (quest) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * @param {Talker} talker
   * @param {string} itemName
   * @returns {number}
   */
  ownItemCount(talker, itemName) {
    const items = talker.getItems();
    const item = items.find(item => item.getName() === itemName);

    if (item) {
      return item.getCount();
    } else {
      return 0;
    }
  }

  /**
   * @param {Talker} talker
   * @param {number} questId
   * @returns {0 | 1} boolean
   */
  getOneTimeQuestFlag(talker, questId) {
    const quests = talker.getQuests();
    const quest = quests.find(quest => quest.id === questId);

    if (quest && quest.isCompleted) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * @param {Talker} talker
   * @param {number} questionMarkId
   */
  showQuestionMark(talker, questionMarkId) {
    this.npcEventBus.emit('showQuestionMark', talker, questionMarkId);
  }

  /**
   * @param {Talker} talker
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  showRadar(talker, x, y, z) {
    this.npcEventBus.emit('showRadar', talker, x, y, z);
  }

  /**
   * @param {Talker} talker
   * @param {string} soundName
   */
  soundEffect(talker, soundName) {
    this.npcEventBus.emit('soundEffect', talker, soundName);
  }

  /**
   * @param {Talker} talker
   * @param {string} itemName
   * @param {number} itemCount
   */
  giveItem(talker, itemName, itemCount) {
    this.npcEventBus.emit('giveItem', talker, itemName, itemCount);
  }

  /**
   * @param {Talker} talker
   * @param {string} itemName
   * @param {number} itemCount
   */
  deleteItem(talker, itemName, itemCount) {
    this.npcEventBus.emit('deleteItem', talker, itemName, itemCount);
  }

  /**
   * @param {Talker} talker
   * @param {Array<*>} sellList
   * @param {string} shopName
   * @param {string} fnBuy
   */
  sell(talker, sellList, shopName, fnBuy) {
    this.npcEventBus.emit('sell', talker, sellList, shopName, fnBuy);
  }

  /**
   * @param {{ _npc: import('../../core/Models/Npc') }} attacker
   */
  addFleeDesire(attacker) {
    attacker._npc.changeState('idle');

    if (!attacker._npc.coordinates) {
      return;
    }

    // fix
    const positions = attacker._npc._getRandomPos(attacker._npc.coordinates);

    let path = {
      target: {
        x: positions[0],
        y: positions[1],
        z: -3115
      },
      origin: {
        x: attacker._npc.x,
        y: attacker._npc.y,
        z: attacker._npc.z
      }
    }

    attacker._npc.action = 'patrol';
    attacker._npc.changeState('move', path);

    console.log(attacker._npc);
    //
  }

  /**
   * @param {Talker} talker
   */
  showSkillList(talker) {
    this.npcEventBus.emit('showSkillList', talker);
  }

  /**
   * @param {Talker} talker
   */
  talkSelect(talker) {
    this.onTalkSelected(talker);
  }

  /**
   * @param {Talker} talker
   * @param {number} ask
   * @param {number} reply
   */
  menuSelect(talker, ask, reply) {
    const self = /** @type {*} */ (this);
    'onMenuSelected' in self && self.onMenuSelected?.(talker, ask, reply);
  }

  /**
   * @param {Talker} talker
   */
  talk(talker) {
    const self = /** @type {*} */ (this);
    'onTalked' in self && self.onTalked?.(talker);
  }

  /**
   * @param {Talker} talker
   */
  teleportRequest(talker) {
    const self = /** @type {*} */ (this);
    'onTeleportRequested' in self && self.onTeleportRequested?.(talker);
  }

  /**
   * @param {Talker} talker
   * @param {number[]} position
   */
  teleport(talker, position) {
    this.npcEventBus.emit('teleport', talker, position);
  }
}

module.exports = DefaultNpc;