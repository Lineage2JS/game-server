const EventEmmiter = require('events');

class SchedulerManager extends EventEmmiter {
  constructor() {
    super();

    this._tasks = [];
  }

  registerTask(payload) {
    const task = {
      id: payload.id,
      isCompleted: false,
      date: payload.date,
    }
    this._tasks.push(task);
  }

  enable() {
    this._run();
  }

  _run() {
    const tasks = this._tasks.filter(task => task.isCompleted === false);

    if (tasks.length > 0) {
      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (task.date < Date.now()) {
          task.isCompleted = true;

          this.emit('completed', task.id)
        }
      }
    }

    setTimeout(this._run.bind(this), 1000);
  }
}

module.exports = new SchedulerManager();