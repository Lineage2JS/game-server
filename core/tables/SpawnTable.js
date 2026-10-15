const spawnList = require('./../../datapack/spawnList.json');

class SpawnTable {
  constructor() {
    this._spawnList = new Map();
    this._init();
  }

  getSpawnList() {
    return this._spawnList;
  }

  getSpawnById(spawnId) {
    return this._spawnList.get(spawnId);
  }

  _init() {
    spawnList.forEach(spawnItem => {
      spawnItem.spawnGroups.forEach((spawnGroup, index) => {
        const names = spawnItem.spawnGroups.map(group => group.name);
        const slicedNames = names.slice(0, index);
        const repeatedNameCount = slicedNames.filter(name => name === spawnGroup.name).length;
        const spawnId = `${spawnItem.spawnZone.id}:${spawnGroup.name}:${repeatedNameCount}`;

        this._spawnList.set(spawnId, {
          spawnPoints: spawnItem.spawnZone.spawnPoints,
          spawnParams: spawnItem.spawnParams,
          spawnGroup,
        })
      });
    });
  }
}

module.exports = new SpawnTable();