const BaseState = require("./BaseState");

class DeadState extends BaseState {
  enter() {
    this.character.hp = 0;
    this.character.emit('died');
    this.character.emit('dropItems'); // TODO тут и NPC и Character в entity
    this.character.target = null;
  }

  update() {
    
  }

  leave() {
    
  }
}

module.exports = DeadState;