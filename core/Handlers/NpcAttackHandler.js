// const playersManager = require('../Managers/PlayersManager');
// const serverPackets = require('../ServerPackets/serverPackets');

class NpcAttackHandler {
  handle(data) {
    const npc = data.npc;
    const attacker = data.attacker;

    console.log(123, npc, attacker)
  }
}

module.exports = NpcAttackHandler;