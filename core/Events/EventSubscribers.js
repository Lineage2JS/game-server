const eventBusNew = require('./EventBusNew');
const NpcDeathHandler = require('./../Handlers/NpcDeathHandler');
const NpcDropItemHandler = require('./../Handlers/NpcDropItemHandler');
const NpcAttackHandler = require('./../Handlers/NpcAttackHandler');
const PlayerEnterHandler = require('./../Handlers/PlayerEnterHandler');
const PlayerExitHandler = require('./../Handlers/PlayerExitHandler');

class EventSubscribers {
  subscribe() {
    const npcDeathHandler = new NpcDeathHandler();
    const npcDropItemHandler = new NpcDropItemHandler();
    const npcAttackHandler = new NpcAttackHandler();
    const playerEnterHandler = new PlayerEnterHandler();
    const playerExitHandler = new PlayerExitHandler();

    eventBusNew.on('npc:died', (data) => npcDeathHandler.handle(data));
    eventBusNew.on('npc:item:drop', (data) => npcDropItemHandler.handle(data));
    eventBusNew.on('npc:attacked', (data) => npcAttackHandler.handle(data));
    eventBusNew.on('player:enter', (data) => playerEnterHandler.handle(data));
    eventBusNew.on('player:exit', (data) => playerExitHandler.handle(data));
  }
}

module.exports = new EventSubscribers();