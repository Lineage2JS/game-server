const npcManager = require('./../Managers/NpcManager');
const server = require('./../Server');

npcManager.on('spawn', (npc) => {
  if (server.isReady()) {
    console.log(`[spawn] ${npc.characterName} ${npc.x} ${npc.y}`);
  }
});