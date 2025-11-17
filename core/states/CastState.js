const BaseState = require("./BaseState");
const CastPayload = require('./../payloads/CastPayload')

//
const entitiesManager = require('./../Managers/EntitiesManager');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const serverPackets = require('./../ServerPackets/serverPackets');
//

class CastState extends BaseState {
  enter() {
    this.payload = this.character.getActionPayload();
    this.character.isCasting = false;
  }

  update() {
    // if (this.character.target === this.character.objectId) {
    //   return;
    // }

    // check if skill self target or no(enemy?)

    if (!this.payload instanceof CastPayload) {
      //this.character.clearAction(); ?
      //this.character.changeState('idle'); ?

      return
    }

    if (!this.character.target) {
      this.character.action = null;
      this.character.changeState('idle');
      
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
          entity.takeDamage(this.character, 30);

          // TODO перенести в takeDamage?
          entity.action = 'attack';
          entity.isRunning = true;
          entity.setMoveType(1); // TODO Enums magic number
          entity.emit('changeMove');
          //entity.state = 'attack';
          entity.target = this.character.objectId;
          //entity.payloadAttack = this.character.objectId;
          entity.changeState('attack', this.character.objectId);
          
          // clearAction
          this.character.action = null;
          //
          this.character.changeState('idle');

          if (entity.hp <= 0) {
            this.character.target = null;
          }
          
          return;
        }

        if (skillId === 1216) {
          this.character.action = '';
          this.character.changeState('idle');

          // TODO temporaty
          const diffHp = this.character.maximumHp - this.character.hp;

          if (diffHp < 20) {
            this.character.hp = this.character.maximumHp;
          } else {
            this.character.hp += 20;
          }
          
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

    const dx = path.target.x - path.origin.x;
    const dy = path.target.y - path.origin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 629) { // 29 - attack range + collision radius
      this.character.changeState('follow');

      return;
    }

    if (this.character.mp < 20) { // TODO magic number
      return;
    }
    
    this.character.castTimestamp = Date.now();
    this.character.isCasting = true;
    this.character.emit('cast', this.payload.getSkill().getSkillId()); // TODO
    this.character.mp = this.character.mp - 20;

    this.character.getClient().sendPacket(new serverPackets.StatusUpdate(this.character.objectId, [
      {
        id: characterStatusEnums.CUR_MP,
        value: this.character.mp,
      },
      {
        id: characterStatusEnums.MAX_MP,
        value: this.character.maximumMp,
      }
    ]));

    // TODO применять эффект скила после того как прошло время
    // if (elapsedTime >= this.castDuration && !this.effectApplied) {
    //   this.applySkillEffect(); // ПРИМЕНЯЕМ ЭФФЕКТ
  }

  leave() {
    this.character.isCasting = false;
  }
}

module.exports = CastState;