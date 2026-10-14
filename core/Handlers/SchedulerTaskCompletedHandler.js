const database = require('./../../database');
const eventBusNew = require('./../Events/EventBusNew');

class SchedulerTaskCompletedHandler {
  async handle(data) {
    if (data.type === 'character-deletion') {
      await database.deleteCharacter(data.payload.characterObjectId);
      await database.deleteCharacterItems(data.payload.characterObjectId);
      await database.deleteCharacterSkills(data.payload.characterObjectId);
    }

    if (data.type === 'npc-respawn') {
      eventBusNew.emit('npc:respawn', JSON.parse(data.payload).npcSpawnId); // TODO!!!
    }
  }
}

module.exports = SchedulerTaskCompletedHandler;