const BaseState = require("./BaseState");

class StopState extends BaseState { // IdleState
  enter() {
    this.character.isMoving = false;

    if (this.character.job === 'attack') {
      this.character.setState('attack', this.character.target); //
    }
  }

  update() {
    
  }

  leave() {
    
  }
}

module.exports = StopState;