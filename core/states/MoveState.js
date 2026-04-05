const BaseState = require("./BaseState");

class MoveState extends BaseState {
  async enter(targetX, targetY, targetZ) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetZ = targetZ;
    this.startX = this.character.x;
    this.startY = this.character.y;
    this.lastUpdateTime = Date.now();
  }

  update() {
    const now = Date.now();
    const delta = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    const dx = this.targetX - this.character.x;
    const dy = this.targetY - this.character.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 9;

    if (distance < 10) {
      this.character.x = this.targetX;
      this.character.y = this.targetY;
      this.character.changeState('idle');
      
      return;
    }

    const step = this.character.runSpeed * delta;
    const angle = Math.atan2(dy, dx);

    this.character.x += Math.cos(angle) * step;
    this.character.y += Math.sin(angle) * step;

    this.character.emit('move', this.targetX, this.targetY, this.targetZ);
  }

  leave() {
    
  }
}

module.exports = MoveState;