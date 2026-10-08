const npcsList = require('./../../datapack/npcsList.json');

class NpcTable {
  constructor() {
    this._npcs = new Map();
    this._init();
  }

  getNpcByName(name) {
    return this._npcs.get(name);
  }

  _init() {
    npcsList.forEach(npcItem => {
      this._npcs.set(npcItem.name, npcItem);
    });
  }
}

module.exports = new NpcTable();