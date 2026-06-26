const EventEmmiter = require('events');
const database = require('./../../database');

/** @typedef {{ type: string, status: string, payload: string, scheduledAt: number, createdAccountId: string, createdType: string }} ScheduledTask */

class SchedulerManager extends EventEmmiter {
  constructor() {
    super();

    /** @type {ScheduledTask[]} */
    this._tasks = [];
  }

  /**
   * @param {ScheduledTask} task
   * @returns {Promise<void>}
   */
  async createTask(task) {
    await database.createScheduledTask(task.type, task.status, task.payload, task.scheduledAt, task.createdAccountId, task.createdType);
  }

  /** @returns {Promise<void>} */
  async reloadTasks() {
    const data = await database.getScheduledTasks();

    //
    this._tasks = /** @type {ScheduledTask[]} */ (data);
    //
  }

  /** @returns {Promise<void>} */
  async enable() {
    await this.reloadTasks();
    this._run();
  }

  /** @returns {Promise<void>} */
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
}

module.exports = new SchedulerManager();