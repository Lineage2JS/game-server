const BaseState = require("./BaseState");
const entitiesManager = require('./../Managers/EntitiesManager');
const { calculateDistance } = require('./../../utils/distance');

class AttackState extends BaseState {
  /** @returns {void} */
  enter() {
    /** @type {import('../Models/Character') | null} */
    this.entity = entitiesManager.getEntityByObjectId(this.character.targetCharacterId);
    /** @type {boolean} */
    this.canDamage = false;
  }

  /** @returns {void} */
  update() {
    if (!this.entity) { // fix
      return;
    }

    if (this.entity.isDead) {
      // if character of npc
      this.character.action = 'patrol';
      this.character.changeState('idle');

      return;
    }

    if (this.character.timeSinceLastAttack > this.character.attackDelay) {
      this.canDamage = true;

      const distance = calculateDistance(this.entity, this.character);

      if (distance > 40) { // 29 - attack range + collision radius TODO magic number
        this.character.changeState('follow');

        return;
      }

      this.character.lastAttackTimestamp = Date.now();
      this.character.emit('attack', this.entity.objectId);

      // if entity instanceof Npc
      // if (this.entity.action === 'patrol') {
      //   this.entity.lastAttackTimestamp = Date.now() - (((500000 / this.entity.baseAttackSpeed) - (500000 / this.character.attackSpeed)) + ((500000 / this.character.attackSpeed) / 2));
      //   this.entity.action = 'attack';
      //   this.entity.setMoveType(1); // TODO Enums magic number
      //   this.entity.emit('changeMove');
      //   //this.entity.state = 'attack';
      //   this.entity.target = this.character.objectId;
      //   //this.entity.payloadAttack = this.character.objectId;
      //   this.entity.changeState('attack', this.character.objectId);
      // }
    }

    if (this.character.timeSinceLastAttack > (this.character.attackDelay / 2) && this.canDamage) {
      this.canDamage = false;

      this.character.attack(this.entity);
    }
  }

  /** @returns {void} */
  leave() {

  }
}

module.exports = AttackState;