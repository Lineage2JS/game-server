const BaseState = require("./BaseState");

class IdleState extends BaseState {
  /** @returns {void} */
  enter() {

  }

  /** @returns {void} */
  update() {
    if (this.character.action === 'attack') {
      this.character.changeState('attack');
    }

    if (this.character.action === 'pickup') {
      this.character.changeState('pickup');
    }

    if (this.character.action === 'talk') {
      this.character.changeState('talk');
    }

    if (this.character.action === 'cast') {
      this.character.changeState('cast');
    }
  }

  /** @returns {void} */
  leave() {

  }
}

module.exports = IdleState;