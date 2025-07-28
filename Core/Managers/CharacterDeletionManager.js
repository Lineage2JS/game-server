const EventEmmiter = require('events');
const schedulerManager = require('./SchedulerManager');

class CharacterDeletionManager extends EventEmmiter {
  constructor() {
    super();

    this._tasks = [];

    schedulerManager.on('completed', (taskId) => {
      this.emit('completed', taskId);
    });
  }

  addTask() {
    schedulerManager.registerTask({
      id: 1234,
      date: Date.now() + 5000,
    });
  }
}

module.exports = new CharacterDeletionManager();