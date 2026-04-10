const BaseState = require("./BaseState");

class MoveState extends BaseState {
  async enter(targetX, targetY, targetZ) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetZ = targetZ;
    this.startX = this.character.x;
    this.startY = this.character.y;
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