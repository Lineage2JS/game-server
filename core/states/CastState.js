const BaseState = require("./BaseState");

//
const entitiesManager = require('./../Managers/EntitiesManager');
//

class CastState extends BaseState {
  enter() {
    
  }

  update() {
    const entity = entitiesManager.getEntityByObjectId(this.payload.target);

    if (!entity) { // fix
      return;
    }

    const path = {
      target: {
        x: entity.x,
        y: entity.y,
        z: entity.z
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
    const distance = Math.sqrt(dx * dx + dy * dy) - 20;

    if (distance > 29) { // 29 - attack range + collision radius
      this.character.changeState('follow', this.character.path);

      return;
    }
    
    this.character.job = '';
    this.character.emit('cast', this.payload.skillId);
    this.character.changeState('stop');
  }

  leave() {
    
  }
}

module.exports = CastState;