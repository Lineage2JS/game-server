const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');

class TalkState extends BaseState {
  enter() {
    const entity = entitiesManager.getEntityById(this.character.getLastTalkedNpcId());

    entity.ai.talk(this.character);
  }

  update() {
    
  }

  leave() {
    
  }
}

module.exports = TalkState;