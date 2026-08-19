const WarriorFlee = require('./WarriorFlee');

class Elpy extends WarriorFlee {
  /**
   * @param {*} npc
   */
  constructor(npc) {
    super();

    this._npc = npc;
  }
}

module.exports = Elpy;