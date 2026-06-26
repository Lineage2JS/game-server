const playersManager = require('./../Managers/PlayersManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const expToLevel = require('./../../utils/expToLevel');

/** @typedef {import('./../Models/Npc')} Npc */
/** @typedef {import('./../Models/Player')} Player */
/** @typedef {{ character: Player }} HitEntry */
/** @typedef {{ character: Npc }} NpcDeathEvent */

class NpcDeathHandler {
  /**
   * @param {NpcDeathEvent} data
   * @returns {void}
   */
  handle(data) {
    /** @type {Npc} */
    const npc = data.character;

    playersManager.emit('notify', new serverPackets.StatusUpdate(npc.objectId, [
      {
        id: characterStatusEnums.CUR_HP,
        value: 0,
      },
      {
        id: characterStatusEnums.MAX_HP,
        value: npc.maximumHp,
      }
    ]));
    playersManager.emit('notify', new serverPackets.Die(npc.objectId));

    setTimeout(() => {
      playersManager.emit('notify', new serverPackets.DeleteObject(npc.objectId));
    }, 3000);

    // get exp
    const hitHistory = /** @type {HitEntry[]} */ (npc.getHitHistory());

    /** @param {HitEntry} entry */
    hitHistory.forEach(entry => {
      /** @type {Player} */
      const attacker = entry.character;

      attacker.exp += 100;
      attacker.emit('updateExp'); // TODO 'updateStatus'
      
      const level = expToLevel(attacker.exp);
      
      if (attacker.level < level) {
        attacker.level = level;
        attacker.emit('updateLevel'); // updateState('levelUp')
        attacker.hp = attacker.maximumHp;
        attacker.mp = attacker.maximumMp;
        attacker.emit('regenerate');
      }
    });
    
    //aiManager.onMyDying(npc.ai.name, player);
    //npc.ai.dying()?
  }
}

module.exports = NpcDeathHandler;