// const playersManager = require('../Managers/PlayersManager');
// const serverPackets = require('../ServerPackets/serverPackets');
/** @typedef {import('../Models/Npc')} Npc */
/** @typedef {import('../Models/Character')} Character */
/** @typedef {{ npc: Npc, attacker: Character }} NpcAttackEvent */

class NpcAttackHandler {
  /**
   * @param {NpcAttackEvent} data
   * @returns {void}
   */
  handle(data) {
    /** @type {Npc} */
    const npc = data.npc;
    /** @type {Character} */
    const attacker = data.attacker;
  }
}

module.exports = NpcAttackHandler;