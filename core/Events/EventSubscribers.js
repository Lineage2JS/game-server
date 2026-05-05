const eventBusNew = require('./EventBusNew');
const NpcDeathHandler = require('./../Handlers/NpcDeathHandler');
const NpcDropItemHandler = require('./../Handlers/NpcDropItemHandler');
const NpcAttackHandler = require('./../Handlers/NpcAttackHandler');

class EventSubscribers {
  subscribe() {
    const npcDeathHandler = new NpcDeathHandler();
    const npcDropItemHandler = new NpcDropItemHandler();
    const npcAttackHandler = new NpcAttackHandler();

    eventBusNew.on('npc:died', (data) => npcDeathHandler.handle(data));
    eventBusNew.on('npc:item:drop', (data) => npcDropItemHandler.handle(data));
    eventBusNew.on('npc:attacked', (data) => npcAttackHandler.handle(data));
  }
}

module.exports = new EventSubscribers();