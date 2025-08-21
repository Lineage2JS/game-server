const BaseState = require("./BaseState");

class PickupState extends BaseState {
  enter() {

  }

  update() {
    const path = {
      target: {
        x: this.character.pickupItem.x, // fix как передавать payload между state
        y: this.character.pickupItem.y,
        z: this.character.pickupItem.z
      },
      origin: {
        x: this.character.x,
        y: this.character.y,
        z: this.character.z
      }
    }

    this.character.path = path;

    const dx = this.character.path.target.x - this.character.x;
    const dy = this.character.path.target.y - this.character.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) { // fix?
      this.character.changeState('move', this.character.path);
      this.character.emit('move');

      return;
    }

    this.character.emit('pickup', this.character.pickupItem); //fix?
    //
    this.character.job = 'stop';
    this.character.changeState('stop');
    //
  }

  leave() {
    
  }
}

module.exports = PickupState;