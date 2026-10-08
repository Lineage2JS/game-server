const EventEmitter = require('events');
const Npc = require('./../Models/Npc');
const npcTable = require('./../tables/NpcTable');
const database = require('./../../database');
const spawnList = require('./../../datapack/spawnList.json');
const ai = require('./../../datapack/ai');

class NpcManager extends EventEmitter {
  constructor() {
    super();    

    this._npcs = new Map();
  }

  spawn(npc) {
    this._npcs.set(npc.objectId, npc);
    this.emit('spawn', npc);
    process.stdout.write(`\r[NPS] ${this._npcs.size}`);
  }

  async enable() {
    await this.spawnNpcs();
  }

  async spawnNpcs() {    
    for (let i = 0; i < spawnList.length; i++) {
      const spawnData = spawnList[i];

      for(let j = 0; j < spawnData['npcMakers']['npcs'].length; j++) {
        const spawnItem = spawnData['npcMakers']['npcs'][j];
        const npcData = npcTable.getNpcByName(spawnItem.name);

        for(let k = 0; k < spawnItem.total; k++) {
          const npc = await this._createNpc(npcData, spawnItem, spawnData);
          
          this.enableNpc(npc);
          this.spawn(npc);
        }
      } 
    }

    process.stdout.write(`\n`);
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

  async _createNpc(npcData, spawnItem, spawnData) {
    const npc = new Npc();

    npc.updateParams(npcData);
    npc.objectId = await database.getNextObjectId();
    npc.maximumHp = npc.hp;
    npc.characterName = npcData.name;
    this._bindNpcEvents(npc);
    this._setupPositions(npc, spawnItem, spawnData);
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

  _setupPositions(npc, spawnItem, spawnData) {
    let positions;

    if (spawnItem.pos === 'anywhere') {
      positions = this._getRandomPos(spawnData['territory']['coordinates']);
    }

    if (Array.isArray(spawnItem.pos)) {
      npc.x = spawnItem.pos[0];
      npc.y = spawnItem.pos[1];
      npc.z = spawnItem.pos[2];
      npc.heading = spawnItem.pos[3];
    } else {
      npc.x = positions[0];
      npc.y = positions[1];
      npc.z = (spawnData['territory']['coordinates'][0]['zMin'] + spawnData['territory']['coordinates'][0]['zMax']) / 2;
    }

    npc.coordinates = spawnData['territory']['coordinates']; // setup Coordinates?
  }

  _setupAi(npc, npcData) {
    const AiInstance = ai[npcData.ai.name];

    if (AiInstance) {
      npc.ai = new AiInstance(npcData.ai.props);
    }
  }

  _getRandomPos(coordinates) {
    let xp = coordinates.map(i => i.x);
    let yp = coordinates.map(i => i.y);

		let max = { x: Math.max(...xp), y: Math.max(...yp) };
		let min = { x: Math.min(...xp), y: Math.min(...yp) };
    
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

