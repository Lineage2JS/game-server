const database = require('./../../database');
const eventBusNew = require('./../Events/EventBusNew');

class SchedulerManager {
  constructor() {
    this._globalTasks = [];
    this._sessionTasks = [];
  }

  async scheduleGlobal({ type, delay, payload, createdBy }) {
    const globalTask = {
      type,
      status: 'new',
      payload,
      scheduledAt: Date.now() + delay,
      createdBy,
      createdType: 'user'
    }

    await this._createGlobalTask(globalTask);
  }

  async scheduleSession({ type, delay, payload, createdBy }) {
    const sessionTask = {
      type,
      status: 'new',
      payload,
      scheduledAt: Date.now() + delay,
      createdBy,
      createdType: 'user'
    }

    this._sessionTasks.push(sessionTask);
  }

  async enable() {
    await this._loadGlobalTasks();
    this._processGlobalTasks();
    this._processSessionTasks();
  }

  async _createGlobalTask(task) {
    await database.createScheduledTask(task.type, task.status, task.payload, task.scheduledAt, task.createdBy, task.createdType);
  }

  async _loadGlobalTasks() {
    this._globalTasks = await database.getScheduledTasks();
  }

  async _processGlobalTasks() {
    const globalTasks = this._globalTasks //.filter(task => task.status === 'new');

    if (globalTasks.length > 0) {
      for(let i = 0; i < globalTasks.length; i++) {
        const globalTask = globalTasks[i];

        if (new Date(globalTask.scheduledAt) < Date.now()) {
          globalTask.status = 'done';

          await database.updateScheduledTask(globalTask);
          eventBusNew.emit('scheduler:task:completed', globalTask);
        }
      }
    }

    await this._loadGlobalTasks();
    setTimeout(this._processGlobalTasks.bind(this), 1000);
  }

  _processSessionTasks() {
    const sessionTasks = this._sessionTasks //.filter(task => task.status === 'new');

    if (sessionTasks.length > 0) {
      for(let i = 0; i < sessionTasks.length; i++) {
        const sessionTask = sessionTasks[i];

        if (new Date(sessionTask.scheduledAt) < Date.now()) {
          sessionTask.status = 'done';

          eventBusNew.emit('scheduler:task:completed', sessionTask);
        }
      }
    }

    setTimeout(this._processSessionTasks.bind(this), 1000);
  }
}

module.exports = new SchedulerManager();