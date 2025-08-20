class BaseState {
  constructor(character, payload = {}) {
    this.character = character;
    this.payload = payload;
  }

  enter() {

  }

  update() {

  }

  leave() {
    
  }
}

module.exports = BaseState;