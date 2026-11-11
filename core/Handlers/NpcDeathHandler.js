const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');
const schedulerManager = require('./../Managers/SchedulerManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const expToLevel = require('./../../utils/expToLevel');

class NpcDeathHandler {
  handle(data) {
    const npc = data.character;

    playersManager.broadcastPacket(new serverPackets.StatusUpdate(npc.objectId, [
      {
        id: characterStatusEnums.CUR_HP,
        value: 0,
      },
      {
        id: characterStatusEnums.MAX_HP,
        value: npc.maxHp,
      }
    ]));
    playersManager.broadcastPacket(new serverPackets.Die(npc.objectId));

    setTimeout(() => {
      playersManager.broadcastPacket(new serverPackets.DeleteObject(npc.objectId));
    }, 3000);

    // get exp
    const hitHistory = npc.getHitHistory();

    hitHistory.forEach(entry => {
      const attacker = entry.character;

      attacker.getProgressStats().setExp(attacker.getProgressStats().getExp() + 100);
      attacker.emit('updateExp'); // TODO 'updateStatus'
      
      const level = expToLevel(attacker.getProgressStats().getExp());
      
      if (attacker.level < level) {
        attacker.level = level;
        attacker.emit('updateLevel'); // updateState('levelUp')
        attacker.hp = attacker.maxHp;
        attacker.mp = attacker.maxMp;
        attacker.emit('regenerate');
      }

      if (npc.getAi() && npc.getAi().onMyDying) { // TODO remove
        npc.getAi().onMyDying(attacker);
      }
    });

    schedulerManager.scheduleSession({
      type: 'npc-respawn',
      delay: 5000,
      payload: JSON.stringify({
        npcSpawnId: npc.getSpawnId()
      }),
      createdBy: '' // TODO ?
    });

    npcManager.removeNpc(npc);
  }
}

module.exports = NpcDeathHandler;