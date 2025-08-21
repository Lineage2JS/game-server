const BaseState = require("./BaseState");

class StopState extends BaseState { // IdleState
  enter() {
    this.character.isMoving = false;

    if (this.character.job === 'attack') { // если follow прекратился то потом атака. Нужен какой-то jobflow?
      this.character.changeState('attack', this.character.target); //
    }

    if (this.character.job === 'pickup') {
      this.character.changeState('pickup', this.character.target); //
    }
  }

  update() {
    
  }

  leave() {
    
  }
}

module.exports = StopState;