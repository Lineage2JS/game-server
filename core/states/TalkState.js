const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');
const { inRange } = require('./../../utils/distance');

class TalkState extends BaseState {
  enter() {
    const entity = entitiesManager.getEntityByObjectId(this.character.targetId); // если target будет null? Вернуть getLastTalk?
    
    if (!inRange(this.character, entity, 100)) {
      this.character.changeState('follow');

      return
    }

    entity.ai.talk(this.character);
  }

  update() {

  }

  leave() {
    
  }
}

module.exports = TalkState;