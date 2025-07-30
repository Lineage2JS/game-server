const EventEmmiter = require('events');
const schedulerManager = require('./SchedulerManager');
const database = require('./../../Database');

class CharacterDeletionManager extends EventEmmiter {
  constructor() {
    super();

    schedulerManager.on('completed', async (task) => {
      if (task.type === 'character-deletion') {
        await database.deleteCharacter(task.payload.characterObjectId);
        await database.deleteCharacterInventory(task.payload.characterObjectId);
      }
    });
  }

  async createTask(playerLogin, characterObjectId) {
    const task = {
      type: 'character-deletion',
      status: 'new',
      payload: JSON.stringify({
        characterObjectId: characterObjectId
      }),
      scheduledAt: Date.now() + 30000,
      createdAccountId: playerLogin,
      createdType: 'user'
    }

    await schedulerManager.createTask(task);
  }
}

module.exports = new CharacterDeletionManager();