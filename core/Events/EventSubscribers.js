const eventBusNew = require('./EventBusNew');
const NpcDeathHandler = require('./../Handlers/NpcDeathHandler');

class EventSubscribers {
  subscribe() {
    const npcDeathHandler = new NpcDeathHandler();

    eventBusNew.on('npc:died', (data) => npcDeathHandler.handle(data));
  }
}

module.exports = new EventSubscribers();