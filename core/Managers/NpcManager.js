const EventEmitter = require('events');
const Npc = require('./../Models/Npc');
const npcTable = require('./../tables/NpcTable');
const spawnTable = require('./../tables/SpawnTable');
const database = require('./../../database');
const ai = require('./../../datapack/ai');

class NpcManager extends EventEmitter {
  constructor() {
    super();    

    this._npcs = new Map();
  }

  async enable() {
    await this.spawnNpcs();
  }

  async spawnNpcs() {
    const spawnList = spawnTable.getSpawnList();

    for (const [spawnId, spawnData] of spawnList) {
      const spawnGroups = spawnData.spawnGroups;

      for(let i = 0; i < spawnGroups.length; i++) {
        const spawnGroup = spawnGroups[i];
        const npcData = npcTable.getNpcByName(spawnGroup.name);

        for(let j = 0; j < spawnGroup.total; j++) {
          await this.spawnNpc(npcData, spawnGroup, spawnData);
          this._showSpawnedNpcCount();
        }
      }
    }

    process.stdout.write(`\n`);
  }

  async spawnNpc(npcData, spawnGroup, spawnData) {
    const npc = await this._createNpc(npcData, spawnGroup, spawnData);
    
    this.addNpc(npc);
    this.enableNpc(npc);
    this.emit('spawn', npc);
  }

  addNpc(npc) {
    this._npcs.set(npc.objectId, npc);
  }

  removeNpc(npc) { // fix так же удалять из EntitiesManager
    return this._npcs.delete(npc.objectId);
  }
  
  enableNpc(npc) {
    if (npc.type === 'warrior') {
      npc.enable();
    }
  }

  getSpawnedNpcs() {
    return this._npcs;
  }

  getNpcByObjectId(objectId) {
    return this._npcs.get(objectId);
  }

  async _createNpc(npcData, spawnGroup, spawnData) {
    const npc = new Npc();

    npc.updateParams(npcData);
    npc.objectId = await database.getNextObjectId();
    npc.maximumHp = npc.hp;
    npc.characterName = npcData.name;
    this._bindNpcEvents(npc);
    this._setupPositions(npc, spawnGroup, spawnData.spawnZone.spawnPoints);
    this._setupSpawnParams(npc, spawnData);
    this._setupAi(npc, npcData);

    return npc;
  }

  _bindNpcEvents(npc) {
    npc.on('move', () => {
      this.emit('move', npc);
    });
    npc.on('attack', (objectId) => {
      this.emit('attack', npc, objectId);
    });
    npc.on('stop', () => {
      this.emit('stop', npc);
    });
    npc.on('changeMove', () => {
      this.emit('changeMove', npc);
    });
    npc.on('damaged', () => {
      this.emit('damaged', npc);
    });
    npc.on('died', () => {
      this.emit('died', npc);
      this.removeNpc(npc);
      
      // setTimeout(() => {
      //   this.spawnNpc(npc.id, coordinates);
      // }, 2000);
    });
  }

  _setupPositions(npc, spawnGroup, spawnPoints) {
    if (spawnGroup.pos === 'anywhere') {
      const [x, y] = this._getRandomPos(spawnPoints);

      npc.x = x;
      npc.y = y;
      npc.z = (spawnPoints[0].zMin + spawnPoints[0].zMax) / 2;
    }

    if (Array.isArray(spawnGroup.pos)) {
      const [x, y, z, heading] = spawnGroup.pos;

      npc.x = x;
      npc.y = y;
      npc.z = z;
      npc.heading = heading;
    }
  }

  _setupSpawnParams(npc, spawnData) {
    npc.setSpawnPoints(spawnData.spawnZone.spawnPoints);
  }

  _setupAi(npc, npcData) {
    const AiInstance = ai[npcData.ai.name];

    if (AiInstance) {
      npc.ai = new AiInstance(npcData.ai.props);
    }
  }

  _showSpawnedNpcCount() {
    process.stdout.write(`\r[NPS] ${this._npcs.size}`);
  }

  _getRandomPos(points) {
    const xp = points.map(i => i.x);
    const yp = points.map(i => i.y);
		const max = { x: Math.max(...xp), y: Math.max(...yp) };
		const min = { x: Math.min(...xp), y: Math.min(...yp) };
		let x;
		let y;
			
		do {
			x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
			y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
		} while(!this._inPoly(xp, yp, x, y))

		return [x, y];
	}

  _inPoly(xp, yp, x, y){
		let npol = xp.length;
		let j = npol - 1;
		let c = false;

		for (let i = 0; i < npol; i++){
			if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
				(x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
				c = !c
			}
			j = i;
		}

		return c;
	}
}

module.exports = new NpcManager();

