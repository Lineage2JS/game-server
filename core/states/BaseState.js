class BaseState {
  /** @param {import('../Models/Character')} character */
  constructor(character) {
    /** @type {import('../Models/Character')} */
    this.character = character;
  }

  /** @returns {void} */
  enter() {

  }

  /** @returns {void} */
  update() {

  }

  /** @returns {void} */
  leave() {
    
  }
}

module.exports = BaseState;