const spawnList = require('./../../datapack/spawnList.json');

class SpawnTable {
  constructor() {
    this._spawnList = new Map();
    this._init();
  }

  getSpawnList() {
    return this._spawnList;
  }

  _init() {
    spawnList.forEach(spawnItem => {
      this._spawnList.set(spawnItem.spawnZone.id, spawnItem);
    });
  }
}

module.exports = new SpawnTable();