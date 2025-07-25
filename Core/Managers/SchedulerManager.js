class SchedulerManager {
  constructor() {
    this._tasks = [];
  }

  registerTask(task) {
    this._tasks.push(task);
  }

  enable() {
    this._run();
  }

  _run() {
    const tasks = this._tasks.filter(task => task.end === false);

    if (tasks.length > 0) {
      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (task.date < Date.now()) {
          task.execute();
          task.end = true;
        }
      }
    }

    setTimeout(this._run.bind(this), 1000);
  }
}

module.exports = new SchedulerManager();