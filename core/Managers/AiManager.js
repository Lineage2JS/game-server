const EventEmitter = require('events');
const ai = require('./../../datapack/ai');
const npcHtmlMessagesManager = require('./NpcHtmlMessagesManager');
const npcEventBus = require('./../Events/NpcEventBus');

class AiManager extends EventEmitter {
  constructor() {
    super();

    npcEventBus.on('showPage', (talker, htmlFileName) => {
      const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName(htmlFileName)

      this.emit('showPage', talker, htmlMessage);
    });

    npcEventBus.on('setMemo', (talker, memo) => {
      this.emit('setMemo', talker, memo);
    });

    npcEventBus.on('showQuestionMark', (talker, questionMarkId) => {
      this.emit('showQuestionMark', talker, questionMarkId);
    });

    npcEventBus.on('showRadar', (talker, x, y, z) => {
      this.emit('showRadar', talker, x, y, z);
    });

    npcEventBus.on('soundEffect', (talker, soundName) => {
      this.emit('soundEffect', talker, soundName);
    });

    npcEventBus.on('giveItem', (talker, itemName, itemCount) => {
      this.emit('giveItem', talker, itemName, itemCount);
    });
    
    npcEventBus.on('deleteItem', (talker, itemName, itemCount) => {
      this.emit('deleteItem', talker, itemName, itemCount);
    });

    npcEventBus.on('sell', (talker, sellList, shopName, fnBuy) => {
      this.emit('sell', talker, sellList, shopName, fnBuy);
    });

    npcEventBus.on('showSkillList', (talker) => {
      this.emit('showSkillList', talker);
    });

    npcEventBus.on('teleport', (talker, position) => {
      this.emit('teleport', talker, position);
    });
  }

  onTalkSelect(aiName, talker) {
    const carl = new ai.Carl();

    carl.onTalkSelected(talker);
  }

  onMyDying(aiName, talker) { // talker = attacker
    //ai.TutoKeltir.onMyDying(talker);
  }

  menuSelect(aiName, talker, ask, reply) {
    ai[aiName].onMenuSelected(talker, ask, reply);
  }

  onAttacked(npc, aiName, attacker) {
    if (aiName === 'Elpy') {
      const elpy = new ai.Elpy(npc);

      elpy.onAttacked(attacker);
    }
  }

  onLearnSkill(aiName, talker) { // scriptName?
    const minx = new ai.Minx();

    minx.onLearnSkillRequested(talker);
  }
}

module.exports = new AiManager();