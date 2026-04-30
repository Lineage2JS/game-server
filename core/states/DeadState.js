const eventBusNew = require('./../Events/EventBusNew');

const BaseState = require('./BaseState');

class DeadState extends BaseState {
  enter() {
    this.character.hp = 0;
    this.character.target = null;
    this.character.emit('died');
    eventBusNew.emit('npc:died', { character: this.character });
    //this.character.emit('dropItems'); // TODO тут и NPC и Character в entity
  }

  update() {
    
  }

  leave() {
    
  }
}

module.exports = DeadState;