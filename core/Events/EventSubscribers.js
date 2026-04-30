const eventBusNew = require('./EventBusNew');
const NpcDeathHandler = require('./../Handlers/NpcDeathHandler');
const NpcDropItemHandler = require('./../Handlers/NpcDropItemHandler');

class EventSubscribers {
  subscribe() {
    const npcDeathHandler = new NpcDeathHandler();
    const npcDropItemHandler = new NpcDropItemHandler();

    eventBusNew.on('npc:died', (data) => npcDeathHandler.handle(data));
    eventBusNew.on('npc:item:drop', (data) => npcDropItemHandler.handle(data));
  }
}

module.exports = new EventSubscribers();