const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');
const { inRange } = require('./../../utils/distance');

class TalkState extends BaseState {

  /** @param {import('../Models/Character')} character */
  constructor(character) {
    super(character);
  }

  /** @returns {void} */
  enter() {
    const entity = entitiesManager.getEntityByObjectId(this.character.targetCharacterId); // если target будет null? Вернуть getLastTalk?

    if (!entity) {
      console.error(`Entity with objectId ${this.character.targetCharacterId} not found`);
      return;
    }

    this.character.lastTalkedNpcId = this.character.targetCharacterId; // TODO

    if (!inRange(this.character, entity, 100)) {
      'changeState' in this.character && typeof this.character.changeState === 'function' && this.character.changeState('follow');

      return
    }

    entity.ai.talk(this.character);
  }

  /** @returns {void} */
  update() {

  }

  /** @returns {void} */
  leave() {

  }
}

module.exports = TalkState;