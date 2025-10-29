const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const skillsManager = require('./../Managers/SkillsManager');

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

    player.setAction('cast', {
      target: player.target,
      skill: skill
    });
  }
}

module.exports = RequestMagicSkillUse;