const ClientPacketNew = require("./ClientPacketNew");
const skillsManager = require('./../Managers/SkillsManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const entitiesManager = require('./../Managers/EntitiesManager');

class RequestMagicSkillUse extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const skillId = this.readD();
    const data0 = this.readD();
    const data1 = this.readC(); // TODO ?
    const entity = entitiesManager.getEntityByObjectId(player.target);
    //const npc = npcManager.getNpcByObjectId(player.target);
    
    if (entity.canBeAttacked === 0) {
      client.sendPacket(new serverPackets.ActionFailed()); // fix?

      return;
    }

    if (player.isCasting) {
      return;
    }

    player.isAttacking = true; // TODO забирать из состояния state атакует или нет
    // К тому же он устаналивается в Action из-за чего я не могу атаковать после каста

    const skill = skillsManager.getSkill(skillId);

    player.doAction('cast', {
      target: player.target,
      skill: skill
    });
  }
}

module.exports = RequestMagicSkillUse;