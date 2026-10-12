const eventBusNew = require('./EventBusNew');
const NpcDeathHandler = require('./../Handlers/NpcDeathHandler');
const NpcRespawnHandler = require('./../Handlers/NpcRespawnHandler');
const NpcDropHandler = require('./../Handlers/NpcDropHandler');
const NpcAttackHandler = require('./../Handlers/NpcAttackHandler');
const PlayerEnterHandler = require('./../Handlers/PlayerEnterHandler');
const PlayerExitHandler = require('./../Handlers/PlayerExitHandler');

class EventSubscribers {
  subscribe() {
    const npcDeathHandler = new NpcDeathHandler();
    const npcRespawnHandler = new NpcRespawnHandler();
    const npcDropHandler = new NpcDropHandler();
    const npcAttackHandler = new NpcAttackHandler();
    const playerEnterHandler = new PlayerEnterHandler();
    const playerExitHandler = new PlayerExitHandler();

    eventBusNew.on('npc:died', (data) => npcDeathHandler.handle(data));
    eventBusNew.on('npc:died', (data) => npcRespawnHandler.handle(data));
    eventBusNew.on('npc:died', (data) => npcDropHandler.handle(data));
    eventBusNew.on('npc:attacked', (data) => npcAttackHandler.handle(data));
    eventBusNew.on('player:enter', (data) => playerEnterHandler.handle(data));
    eventBusNew.on('player:exit', (data) => playerExitHandler.handle(data));
  }
}

module.exports = new EventSubscribers();