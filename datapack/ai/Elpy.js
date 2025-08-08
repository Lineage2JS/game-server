const WarriorFlee = require('./WarriorFlee');

class Elpy extends WarriorFlee {
  constructor(npc) {
    super();

    this._npc = npc;
  }
}

module.exports = Elpy;