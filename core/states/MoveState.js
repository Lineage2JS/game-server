const BaseState = require("./BaseState");

class MoveState extends BaseState {
  async enter() {
    this.targetX = this.character.targetX;
    this.targetY = this.character.targetY;
    this.targetZ = this.character.targetZ;
  }

  update() {
    const arrived = this.character.moveTo(this.targetX, this.targetY, this.targetZ);
    
    if (arrived) {
      this.character.changeState('idle');

      return;
    }

    this.character.emit('move', this.targetX, this.targetY, this.targetZ);
  }

  leave() {
    
  }
}

module.exports = MoveState;