const BaseState = require("./BaseState");

//
const npcManager = require('./../Managers/NpcManager');
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
    this.character.isDamage = false;
  }

  update() {
    const npc = npcManager.getNpcByObjectId(this.payload);

    if (!npc) { // fix
      return;
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / 330)) {
      this.character.isDamage = false;

      const path = {
        target: {
          x: npc.x,
          y: npc.y,
          z: npc.z
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
  
      this.character._client.sendPacket(new serverPackets.Attack(this.character, npc.objectId, this.character._activeSoulShot));
  
      this.character._activeSoulShot = false;

      if (npc.job === 'patrol') {
        npc.job = 'attack';
        npc.state = 'attack';
        npc.target = this.character.objectId;
        npc.payloadAttack = this.character.objectId;
        npc.lastAttackTimestamp = Date.now() - (((500000 / npc.baseAttackSpeed) - (500000 / this.character.baseAttackSpeed)) + ((500000 / this.character.baseAttackSpeed) / 2));
      }
    }

    if ((Date.now() - this.character.lastAttackTimestamp) > ((500000 / 330 / 2)) && !this.character.isDamage) {
      if (npc.hp > 0) {
        npc.hp = npc.hp - 10;

        this.character._client.sendPacket(new serverPackets.StatusUpdate(this.payload, [
          {
            id: characterStatusEnums.CUR_HP,
            value: npc.hp,
          },
          {
            id: characterStatusEnums.MAX_HP,
            value: npc.maximumHp,
          }
        ]));

        this.character.isDamage = true;
      }

      if (npc.hp <= 0) {
        npc.job = 'dead';
        npc.updateState('stop');
        npc.emit('died');
        npc.emit('dropItems');

        this.character.exp += 100;
        this.character.emit('updateExp');

        {
          const level = findLevel(this.character.exp);
          
          if (this.character.level < level) {
            this.character.level = level;

            this.character.emit('updateLevel');
          }
        }

        { // fix test
          aiManager.onMyDying(npc.ai.name, this);
        }
        
        this.character.target = null;
        this.character.isAttacking = false;
      }
    }
  }

  leave() {
    
  }
}

module.exports = AttackState;