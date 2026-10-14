const database = require('./../../database');

class SchedulerTaskCompletedHandler {
  async handle(data) {
    if (data.type === 'character-deletion') {
      await database.deleteCharacter(data.payload.characterObjectId);
      await database.deleteCharacterItems(data.payload.characterObjectId);
      await database.deleteCharacterSkills(data.payload.characterObjectId);
    }
  }
}

module.exports = SchedulerTaskCompletedHandler;