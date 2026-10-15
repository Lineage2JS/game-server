const npcManager = require('./../Managers/NpcManager');
const npcTable = require('./../tables/NpcTable');
const spawnTable = require('./../tables/SpawnTable');

class NpcRespawnHandler {
  async handle(data) {
    const spawnId = data;
    const spawnData = spawnTable.getSpawnById(spawnId);
    const { spawnGroup, spawnPoints } = spawnData;
    const npcData = npcTable.getNpcByName(spawnGroup.name);
        
    await npcManager.spawnNpc(npcData, spawnId, spawnGroup, spawnPoints);
  }
}

module.exports = NpcRespawnHandler