const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

//
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const levelExpTable = require('./../data/exp.json');
const npcManager = require('./../Managers/NpcManager');
const aiManager = require('./../Managers/AiManager');
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

class RequestMagicSkillUse {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get skillId() {
    return this._data.getData()[0];
  }

  get data0() { // fix?
    return this._data.getData()[1];
  }

  get data1() {
    return this._data.getData()[2];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.skillId === 1068) {
      this._client.sendPacket(new serverPackets.MagicSkillUse(player, {
        id: this.skillId,
        level: 1,
        hitTime: 4000, //1.08,
        reuseDelay: 4000 //13
      }));

      this._client.sendPacket(new serverPackets.MagicSkillLaunched(player, {
        id: this.skillId,
        level: 1
      }));

      this._client.sendPacket(new serverPackets.AbnormalStatusUpdate([
        {
          skillId: this.skillId,
          level: 1,
          duration: 10000
        }
      ]));

      return;
    }

    if (this.skillId === 1216) {
      this._client.sendPacket(new serverPackets.MagicSkillUse(player, {
        id: this.skillId,
        level: 1,
        hitTime: 4000, //1.08,
        reuseDelay: 4000 //13
      }));
  
      this._client.sendPacket(new serverPackets.MagicSkillLaunched(player, {
        id: this.skillId,
        level: 1
      }));

      this._client.sendPacket(new serverPackets.SetupGauge(0, 4000));

      return;
    }

    this._client.sendPacket(new serverPackets.MagicSkillUse(player, {
      id: this.skillId,
      level: 1,
      hitTime: 4000, //1.08,
      reuseDelay: 4000 //13
    }));

    this._client.sendPacket(new serverPackets.MagicSkillLaunched(player, {
      id: this.skillId,
      level: 1
    }));

    this._client.sendPacket(new serverPackets.SetupGauge(0, 4000));

    //
    const npc = npcManager.getNpcByObjectId(player.target);

    if (npc.job === 'patrol') {
      setTimeout(() => {
        npc.hp = npc.hp - 30;
        npc.job = 'attack';
        npc.target = player.objectId;
        npc.updateState('stop'); // attack, if attack = stop > attack or follow

        this._client.sendPacket(new serverPackets.StatusUpdate(npc.objectId, [
          {
            id: characterStatusEnums.CUR_HP,
            value: npc.hp,
          },
          {
            id: characterStatusEnums.MAX_HP,
            value: npc.maximumHp,
          }
        ]));
      }, 4000);
    }

    if (npc.job === 'attack') {
      setTimeout(() => {
        npc.hp = npc.hp - 30;

        //
        if (npc.hp <= 0) {
          npc.job = 'dead';
          npc.updateState('stop');
          npc.emit('died');
          npc.emit('dropItems');

          player.exp += 100;
          player.emit('updateExp');

          {
            const level = findLevel(player.exp);
            
            if (player.level < level) {
              player.level = level;

              player.emit('updateLevel');
            }
          }

          { // fix test
            aiManager.onMyDying(npc.ai.name, player);
          }
          
          player.target = null;
          player.isAttacking = false;
    
          setTimeout(() => {
            this._client.sendPacket(new serverPackets.AutoAttackStop(player.objectId));
          }, 3000);
    
          return;
        }
        //

        this._client.sendPacket(new serverPackets.StatusUpdate(npc.objectId, [
          {
            id: characterStatusEnums.CUR_HP,
            value: npc.hp,
          },
          {
            id: characterStatusEnums.MAX_HP,
            value: npc.maximumHp,
          }
        ]));
      }, 4000);
    }
    //
  }
}

module.exports = RequestMagicSkillUse;