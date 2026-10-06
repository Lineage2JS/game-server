const EventEmmiter = require('events');
const database = require('./../../database');

class SchedulerManager extends EventEmmiter {
  constructor() {
    super();

    this._tasks = [];
    this.on('completed', this._onCompleted);
  }

  async createTask(task) {
    await database.createScheduledTask(task.type, task.status, task.payload, task.scheduledAt, task.createdAccountId, task.createdType);
  }

  async reloadTasks() {
    this._tasks = await database.getScheduledTasks();
  }

  async enable() {
    await this.reloadTasks();
    this._run();
  }

  async _run() {
    const tasks = this._tasks //.filter(task => task.status === 'new');

    if (tasks.length > 0) {
      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (new Date(task.scheduledAt) < Date.now()) {
          task.status = 'done';

          await database.updateScheduledTask(task);

          this.emit('completed', task);
        }
      }
    }

    await this.reloadTasks();

    setTimeout(this._run.bind(this), 1000);
  }

  async _onCompleted(task) {
    if (task.type === 'character-deletion') {
      await database.deleteCharacter(task.payload.characterObjectId);
      await database.deleteCharacterItems(task.payload.characterObjectId);
      await database.deleteCharacterSkills(task.payload.characterObjectId);
    }
  }
}

module.exports = new SchedulerManager();