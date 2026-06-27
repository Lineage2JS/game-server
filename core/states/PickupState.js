const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');

class PickupState extends BaseState {
  /** @returns {void} */
  enter() {
    /** @type {import('../Models/DropItem') | null} */
    this.entity = entitiesManager.getEntityByObjectId(this.character.targetItemId);
    /** @type {number | null} */
    this.originX = this.character.x;
    /** @type {number | null} */
    this.originY = this.character.y;
    /** @type {number | null} */
    this.originZ = this.character.z;
    /** @type {number | null} */
    this.targetX = this.entity.x;
    /** @type {number | null} */
    this.targetY = this.entity.y;
    /** @type {number | null} */
    this.targetZ = this.entity.z;
  }

  /** @returns {void} */
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

  /** @returns {void} */
  leave() {

  }
}

module.exports = PickupState;