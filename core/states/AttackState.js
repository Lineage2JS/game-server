const BaseState = require("./BaseState");

//
const entitiesManager = require('./../Managers/EntitiesManager');
const aiManager = require('./../Managers/AiManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const levelExpTable = require('./../../datapack/exp.json');
//

//
function findLevel(exp) { // оптимизировать get level by exp
  let level = 1;
  
  // Перебираем уровни, пока не найдем нужный
  for (let i = 1; i <= 60; i++) {
    if (exp >= levelExpTable[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  return level;
}
//

class AttackState extends BaseState { // fix много в коде
  enter() {
    this.entity = entitiesManager.getEntityByObjectId(this.character.targetId);
    this.character.isDamage = false;
  }

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

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / this.character.attackSpeed)) {
      this.character.isDamage = true;
  
      const dx = this.entity.x - this.character.x;
      const dy = this.entity.y - this.character.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 40) { // 29 - attack range + collision radius TODO magic number
        this.character.changeState('follow');
  
        return;
      }
      
      this.character.lastAttackTimestamp = Date.now();
  
      this.character.emit('attack', this.entity.objectId);

      //this.character._activeSoulShot = false;
      
      // if entity instanceof Npc
      if (this.entity.action === 'patrol') {
        this.entity.lastAttackTimestamp = Date.now() - (((500000 / this.entity.baseAttackSpeed) - (500000 / this.character.attackSpeed)) + ((500000 / this.character.attackSpeed) / 2));
        this.entity.action = 'attack';
        this.entity.setMoveType(1); // TODO Enums magic number
        this.entity.emit('changeMove');
        //this.entity.state = 'attack';
        this.entity.target = this.character.objectId;
        //this.entity.payloadAttack = this.character.objectId;
        this.entity.changeState('attack', this.character.objectId);
      }
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / this.character.attackSpeed / 2) && this.character.isDamage) {
      if (this.entity.hp > 0 && this.entity.action !== 'dead') { // TODO !this.entity.isDead()
        this.entity.takeDamage(this.character, 10);

        this.character.isDamage = false; // TODO зачем это
      }

      if (this.entity.hp <= 0) {
        // if character of npc
        this.character.action = 'patrol';        
        this.character.target = null;
        this.character.isAttacking = false;

        this.character.changeState('idle');
      }
    }
  }

  leave() {
    
  }
}

module.exports = AttackState;