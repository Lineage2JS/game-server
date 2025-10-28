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
    this.character.isDamage = false;
  }

  update() {
    const entity = entitiesManager.getEntityByObjectId(this.payload);

    if (!entity) { // fix
      return;
    }

    if (entity.isDead) {
      // if character of npc
      this.character.action = 'patrol';
      this.character.changeState('idle');

      return;
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / this.character.attackSpeed)) {
      this.character.isDamage = true;
  
      const dx = entity.x - this.character.x;
      const dy = entity.y - this.character.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 30) { // 29 - attack range + collision radius
        this.character.changeState('follow');
  
        return;
      }
      
      this.character.lastAttackTimestamp = Date.now();
  
      this.character.emit('attack', entity.objectId);

      //this.character._activeSoulShot = false;
      
      // if entity instanceof Npc
      if (entity.action === 'patrol') {
        entity.lastAttackTimestamp = Date.now() - (((500000 / entity.baseAttackSpeed) - (500000 / this.character.attackSpeed)) + ((500000 / this.character.attackSpeed) / 2));
        entity.action = 'attack';
        entity.isRunning = true;
        entity.emit('changeMove');
        //entity.state = 'attack';
        entity.target = this.character.objectId;
        //entity.payloadAttack = this.character.objectId;
        entity.changeState('attack', this.character.objectId);
      }
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / this.character.attackSpeed / 2) && this.character.isDamage) {
      if (entity.hp > 0) {
        entity.hp = entity.hp - 10;

        entity.emit('damaged');

        this.character.isDamage = false; // TODO зачем это
      }

      if (entity.hp <= 0) {
        entity.action = 'dead';
        entity.changeState('idle');
        entity.emit('died');
        entity.emit('dropItems'); // TODO тут и NPC и Character в entity
        entity.isDead = true;
        entity.target = null;

        // if character of npc
        this.character.action = 'patrol';
        
        // if character of player
        //this.character.exp += 100;
        //this.character.emit('updateExp');

        // {
        //   const level = findLevel(this.character.exp);
          
        //   if (this.character.level < level) {
        //     this.character.level = level;

        //     this.character.emit('updateLevel');
        //   }
        // }

        // { // fix test
        //   aiManager.onMyDying(entity.ai.name, this);
        // }
        
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