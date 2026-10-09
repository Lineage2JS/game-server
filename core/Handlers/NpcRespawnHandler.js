const npcManager = require('./../Managers/NpcManager');
const npcTable = require('./../tables/NpcTable');
const spawnTable = require('./../tables/SpawnTable');

class NpcRespawnHandler {
  async handle(data) {
    const npc = data.character;
    const spawnList = spawnTable.getSpawnList();

    npcManager.on('spawn', (npc) => {
      console.log(npc.x, npc.y);
    })

    for (const [spawnId, spawnData] of spawnList) {
      const spawnGroups = spawnData.spawnGroups;
      
      for(let i = 0; i < spawnGroups.length; i++) {
        const spawnGroup = spawnGroups[i];

        if (npc.characterName === spawnGroup.name) {
          const npcData = npcTable.getNpcByName(npc.characterName);
          
          await npcManager.spawnNpc(npcData, spawnGroup, spawnData);
        }
      }
    }
  }
}

module.exports = NpcRespawnHandler