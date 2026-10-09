const npcsList = require('./../../datapack/npcsList.json');

class NpcTable {
  constructor() {
    this._npcsList = new Map();
    this._init();
  }

  getNpcByName(name) {
    return this._npcsList.get(name);
  }

  _init() {
    npcsList.forEach(npcItem => {
      this._npcsList.set(npcItem.name, npcItem);
    });
  }
}

module.exports = new NpcTable();