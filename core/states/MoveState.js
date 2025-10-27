const BaseState = require("./BaseState");

class MoveState extends BaseState {
  async enter() {
    this.character.path = this.payload;

    if (!this.character.isMoving) {
      this.character.emit('move');

      this.character.positionUpdateTimestamp = this.character.lastUpdateTimestamp;
      this.character.isMoving = true;
    }

    if (this.character.action === 'move') {
      this.character.isAttacking = false;
    }
  }

  update() {
    this.character.updatePosition();
  }

  leave() {
    
  }
}

module.exports = MoveState;