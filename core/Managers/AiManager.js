const EventEmitter = require('events');
const ai = require('./../../datapack/ai');
const npcHtmlMessagesManager = require('./NpcHtmlMessagesManager');
const npcEventBus = require('./../Events/NpcEventBus');

/** @typedef {import('./../Models/Npc')} Npc */
/** @typedef {import('./../Models/Player')} Player */

/** @typedef {{ x: number, y: number, z: number }} Position */

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

  /**
   * @param {keyof typeof ai} aiName
   * @param {Player} talker
   * @returns {void}
   */
  onTalkSelect(aiName, talker) {
    this.callAiMethod(aiName, 'onTalkSelected', talker);
  }

  /**
   * @param {keyof typeof ai} aiName
   * @param {Player} talker
   * @returns {void}
   */
  onMyDying(aiName, talker) { // talker = attacker
    // this.callAiMethod(aiName, 'onMyDying', talker);
  }

  /**
   * @param {keyof typeof ai} aiName
   * @param {Player} talker
   * @param {number} ask
   * @param {number} reply
   * @returns {void}
   */
  menuSelect(aiName, talker, ask, reply) {
    this.callAiMethod(aiName, 'onMenuSelected', talker, ask, reply);
  }

  /**
   * @param {Npc} npc
   * @param {keyof typeof ai} aiName
   * @param {Player} attacker
   * @returns {void}
   */
  onAttacked(npc, aiName, attacker) {
    this.callAiMethod(aiName, 'onAttacked', attacker);
  }

  /**
   * @param {keyof typeof ai} aiName
   * @param {Player} talker
   * @returns {void}
   */
  onLearnSkill(aiName, talker) { // scriptName?
    this.callAiMethod(aiName, 'onLearnSkillRequested', talker);
  }

  /**
   * @param {keyof typeof ai} aiName
   * @param {*} [props] ai props
   * @returns {* | null} AI instance or null if not found
   */
  getAiInstance(aiName, props) {
    return AiManager.getAiInstance(aiName, props);
  }

  /**
   * @param {keyof typeof ai} aiName key of ai registry
   * @param {*} [props] ai props
   * @returns {* | null} AI instance or null if not found
   */
  static getAiInstance(aiName, props) {
    if (aiName in ai) {
      return new ai[aiName](props);
    }

    return null;
  }

  /**
   * @param {keyof typeof ai} aiName
   * @param {string} methodName
   * @param  {...*} args
   */
  callAiMethod(aiName, methodName, ...args) {
    const aiInstance = this.getAiInstance(aiName);

    // check interface
    aiInstance && methodName in aiInstance && aiInstance[methodName]?.(...args);
  }
}

// singleton
module.exports = new AiManager();