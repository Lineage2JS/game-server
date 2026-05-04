const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');

class PickupState extends BaseState {
  enter() {
    this.entity = entitiesManager.getEntityByObjectId(this.character.itemId);
    this.originX = this.character.x;
    this.originY = this.character.y;
    this.originZ = this.character.z;
    this.targetX = this.entity.x;
    this.targetY = this.entity.y;
    this.targetZ = this.entity.z;
  }

  update() {
    const arrived = this.character.moveTo(this.targetX, this.targetY, this.targetZ);

    if (arrived) {
      this.character.emit('pickup', this.entity.objectId);
      this.character.clearAction();
      this.character.changeState('idle');
      
      return;
    }

    this.character.emit('move', this.targetX, this.targetY, this.targetZ);
  }

  leave() {
    
  }
}

module.exports = PickupState;