const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');
const { inRange } = require('./../../utils/distance');

class TalkState extends BaseState {
  enter() {
    const entity = entitiesManager.getEntityById(this.character.getLastTalkedNpcId());

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