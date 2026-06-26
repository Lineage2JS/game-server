const BaseState = require("./BaseState");

class MoveState extends BaseState {
  /** @returns {Promise<void>} */
  async enter() {
    /** @type {number | null} */
    this.targetX = this.character.targetX;
    /** @type {number | null} */
    this.targetY = this.character.targetY;
    /** @type {number | null} */
    this.targetZ = this.character.targetZ;
  }

  /** @returns {void} */
  update() {
    const arrived = this.character.moveTo(this.targetX, this.targetY, this.targetZ);
    
    if (arrived) {
      this.character.changeState('idle');

      return;
    }

    this.character.emit('move', this.targetX, this.targetY, this.targetZ);
  }

  /** @returns {void} */
  leave() {
    
  }
}

module.exports = MoveState;