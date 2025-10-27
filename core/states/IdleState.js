const BaseState = require("./BaseState");

class IdleState extends BaseState { // IdleState
  enter() {
    this.character.isMoving = false;
  }

  update() {
    if (this.character.action === 'attack') {
      this.character.changeState('attack', this.character.target); // TODO нужен ли тут payload?
    }

    if (this.character.action === 'pickup') {
      this.character.changeState('pickup', this.character.target); //
    }

    if (this.character.action === 'talk') {
      this.character.changeState('talk');
    }

    if (this.character.action === 'cast') {
      this.character.changeState('cast');
    }
  }

  leave() {
    
  }
}

module.exports = IdleState;