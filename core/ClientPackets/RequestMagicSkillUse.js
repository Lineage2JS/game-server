const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const skillsManager = require('./../Managers/SkillsManager');

//
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const levelExpTable = require('./../../datapack/exp.json');
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
    //const npc = npcManager.getNpcByObjectId(player.target);
    
    if (player.isCasting) {
      return;
    }

    player.isAttacking = true; // TODO забирать из состояния state атакует или нет
    // К тому же он устаналивается в Action из-за чего я не могу атаковать после каста

    const skill = skillsManager.getSkill(this.skillId);

    player.updateJob('cast', {
      target: player.target,
      skill: skill
    })
    
    // player.exp += 100;
    // player.emit('updateExp'); TODO 'updateStatus'
    // const level = findLevel(player.exp);
    // if (player.level < level)
    // player.level = level;
    // player.emit('updateLevel'); updateState('levelUp')
    // aiManager.onMyDying(npc.ai.name, player);
  }
}

module.exports = RequestMagicSkillUse;