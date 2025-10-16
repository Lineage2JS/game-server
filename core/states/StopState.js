const BaseState = require("./BaseState");

class StopState extends BaseState { // IdleState
  enter() {
    this.character.isMoving = false;

    if (this.character.job === 'attack') {
      this.character.changeState('attack', this.character.target); //
    }

    if (this.character.job === 'pickup') {
      this.character.changeState('pickup', this.character.target); //
    }

    if (this.character.job === 'talk') {
      this.character.changeState('talk');
    }

    if (this.character.job === 'cast') {
      this.character.changeState('cast');
    }
  }

  update() {
    
  }

  leave() {
    
  }
}

module.exports = StopState;