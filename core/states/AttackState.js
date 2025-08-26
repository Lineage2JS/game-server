const BaseState = require("./BaseState");

//
const entitiesManager = require('./../Managers/EntitiesManager');
const aiManager = require('./../Managers/AiManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const levelExpTable = require('./../data/exp.json');
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

class AttackState extends BaseState {
  enter() {
    this.character.isDamage = true; // fix? logic
  }

  update() {
    const entity = entitiesManager.getEntityByObjectId(this.payload);

    if (!entity) { // fix
      return;
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / 330)) {
      this.character.isDamage = false;

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
      
      this.character.lastAttackTimestamp = Date.now();
  
      this.character.emit('attack', entity.objectId);

      //this.character._activeSoulShot = false;
      
      // if entity instanceof Npc
      if (entity.job === 'patrol') {
        entity.lastAttackTimestamp = Date.now() - (((500000 / entity.baseAttackSpeed) - (500000 / this.character.baseAttackSpeed)) + ((500000 / this.character.baseAttackSpeed) / 2));
        entity.job = 'attack';
        entity.isRunning = true;
        entity.emit('changeMove');
        //entity.state = 'attack';
        entity.target = this.character.objectId;
        //entity.payloadAttack = this.character.objectId;
        entity.changeState('attack', this.character.objectId);
      }
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / 330 / 2) && !this.character.isDamage) {
      if (entity.hp > 0) {
        entity.hp = entity.hp - 10;

        entity.emit('damaged');

        this.character.isDamage = true;
      }

      if (entity.hp <= 0) {
        entity.job = 'dead';
        entity.changeState('stop');
        entity.emit('died');
        entity.emit('dropItems');

        // if character of npc
        this.character.job = 'patrol';
        
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

        this.character.changeState('stop');
      }
    }
  }

  leave() {
    
  }
}

module.exports = AttackState;