const ClientPacketNew = require("./ClientPacketNew");
const serverPackets = require('./../ServerPackets/serverPackets');
const entitiesManager = require('./../Managers/EntitiesManager');

class RequestMagicSkillUse extends ClientPacketNew {
  static code = 0x2F;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const skillId = this.readD();
    const data0 = this.readD();
    const data1 = this.readC(); // TODO ?
    const entity = entitiesManager.getEntityByObjectId(player.target);
    
    if (entity.canBeAttacked === 0) {
      client.sendPacket(new serverPackets.ActionFailed()); // fix?

      return;
    }

    if (player.isCasting) {
      return;
    }

    player.doAction('cast', player.target, skillId);
  }
}

module.exports = RequestMagicSkillUse;