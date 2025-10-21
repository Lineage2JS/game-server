const BaseState = require("./BaseState");
const CastPayload = require('./../payloads/CastPayload')

//
const entitiesManager = require('./../Managers/EntitiesManager');
//

class CastState extends BaseState {
  enter() {
    this.payload = this.character.getJobPayload();
    this.character.isCasting = false;
  }

  update() {
    // if (this.character.target === this.character.objectId) {
    //   return;
    // }

    // check if skill self target or no(enemy?)

    if (!this.payload instanceof CastPayload) {
      //this.character.clearJob(); ?
      //this.character.changeState('stop'); ?

      return
    }

    if (!this.character.target) {
      this.character.job = null;
      this.character.changeState('stop');
      
      return;
    }

    const skillId = this.payload.getSkill().getSkillId();
    const entity = entitiesManager.getEntityByObjectId(this.payload.getTarget());

    // if (!entity) { // fix
    //   return;
    // }

    if (this.character.isCasting) {
      if ((Date.now() - this.character.castTimestamp) > (4000 / 333) * 333 ) { // (HitTime / CastSpeed) * 333
        if (skillId === 1177) {
          entity.hp = entity.hp - 30;

          entity.emit('damaged');
          // for attack
          //entity.lastAttackTimestamp = Date.now() - (((500000 / entity.baseAttackSpeed) - (500000 / this.character.baseAttackSpeed)) + ((500000 / this.character.baseAttackSpeed) / 2));
          entity.job = 'attack';
          entity.isRunning = true;
          entity.emit('changeMove');
          //entity.state = 'attack';
          entity.target = this.character.objectId;
          //entity.payloadAttack = this.character.objectId;
          entity.changeState('attack', this.character.objectId);
          
          // clearJob
          this.character.job = null;
          //
          this.character.changeState('stop');

          if (entity.hp <= 0) {
            entity.job = 'dead';
            entity.changeState('stop');
            entity.emit('died');
            entity.emit('dropItems'); // TODO тут и NPC и Character в entity
            entity.isDead = true;
            entity.target = null;
            this.character.target = null;
          }
          
          return;
        }

        if (skillId === 1216) {
          this.character.job = '';
          this.character.changeState('stop');

          // TODO temporaty
          this.character.hp += 20;
          this.character.emit('regenerate');
          //
        }
      }

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

    if (distance > 600) { // 29 - attack range + collision radius
      this.character.changeState('follow');

      return;
    }
    
    this.character.castTimestamp = Date.now();
    this.character.isCasting = true;
    this.character.emit('cast', this.payload.getSkill().getSkillId()); // TODO

    // TODO применять эффект скила после того как прошло время
    // if (elapsedTime >= this.castDuration && !this.effectApplied) {
    //   this.applySkillEffect(); // ПРИМЕНЯЕМ ЭФФЕКТ
  }

  leave() {
    this.character.isCasting = false;
  }
}

module.exports = CastState;