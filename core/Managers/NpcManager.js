const EventEmitter = require('events');
const Npc = require('./../Models/Npc');
const database = require('./../../database');
const npcsList = require('./../../datapack/npcsList.json');
const spawnList = require('./../../datapack/spawnList.json');

/** @typedef {{ x: number, y: number, zMin: number, zMax: number }} TerritoryCoordinate */
/** @typedef {[number, number]} Position2D */

class NpcManager extends EventEmitter {
  constructor() {
    super();    

    /** @type {Npc[]} */
    this._npcs = [];
  }

  /**
   * @param {Npc} npc
   * @returns {void}
   */
  spawn(npc) {
    this._npcs.push(npc);
    console.log(this._npcs.length)
    this.emit('spawn', npc);
  }

  /** @returns {Promise<void>} */
  async enable() {
    await this.spawnNpcs();
  }

  /** @returns {Promise<void>} */
  async spawnNpcs() {    
    for (let i = 0; i < spawnList.length; i++) {
      const spawnData = spawnList[i];

      for(let j = 0; j < spawnData['npcMakers']['npcs'].length; j++) {
        const npcItem = spawnData['npcMakers']['npcs'][j];
        const npcData = npcsList.find(data => data.name === npcItem.name);

        for(let k = 0; k < npcItem.total; k++) {
          const npc = new Npc();

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
            this.remove(npc);
            
            setTimeout(() => {
              this.spawnNpc(npc.id, spawnData['territory']['coordinates']);
            }, 2000);
          });

          npc.updateParams(npcData);

          npc.baseAttackSpeed = 330; // fix remove брать из датапака
          
          npc.objectId = await database.getNextObjectId();
          
          let positions;

          if (npcItem.pos === 'anywhere') {
            positions = this._getRandomPos(spawnData['territory']['coordinates']);
          }

          if (Array.isArray(npcItem.pos)) {
            npc.x = npcItem.pos[0];
            npc.y = npcItem.pos[1];
            npc.z = npcItem.pos[2];
            npc.heading = npcItem.pos[3];
          } else {
            npc.x = positions[0];
            npc.y = positions[1];
            npc.z = (spawnData['territory']['coordinates'][0]['zMin'] + spawnData['territory']['coordinates'][0]['zMax']) / 2;
          }

          npc.maximumHp = npc.hp; // fix
          npc.characterName = npcData.name;
          //
          const ai = require('./../../datapack/ai');
          const AiInstance = ai[npcData.ai.name];

          if (AiInstance) {
            npc.ai = new AiInstance(npcData.ai.props);
          }
          
          //
          this.spawn(npc);

          if (npc.type === 'warrior') {
            npc.coordinates = spawnData['territory']['coordinates'];

            npc.enable(); // fix. По AI ждать 5 сек
          }
        }
      } 
    }

    console.log('spawn end')
  }

  /**
   * @param {number} id
   * @param {TerritoryCoordinate[]} coordinates
   * @returns {Promise<void>}
   */
  async spawnNpc(id, coordinates) {
    const npcData = npcsList.find(npcItem => npcItem.id === id);
    const npc = new Npc();

    npc.updateParams(npcData);

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
      this.remove(npc);
      
      setTimeout(() => {
        this.spawnNpc(npc.id, coordinates);
      }, 2000);
    });

    npc.objectId = await database.getNextObjectId();
        
    const positions = this._getRandomPos(spawnList[0]['territory']['coordinates']); // fix

    npc.coordinates = coordinates;

    npc.x = positions[0];
    npc.y = positions[1];
    npc.z = (coordinates[0]['zMin'] + coordinates[0]['zMax']) / 2;;
    npc.maximumHp = npc.hp; // fix

    this.spawn(npc);
    npc.enable();
  }

  /**
   * @param {Npc} npc
   * @returns {void}
   */
  remove(npc) { // fix так же удалять из EntitiesManager
    const npcRemove = this._npcs.indexOf(npc);

    this._npcs.splice(npcRemove, 1);
  }
  
  /** @returns {Npc[]} */
  getSpawnedNpcs() {
    return this._npcs;
  }

  /**
   * @param {number} objectId
   * @returns {Npc | undefined}
   */
  getNpcByObjectId(objectId) {
    const npc = this._npcs.find(npc => npc.objectId === objectId);

    return npc;
  }

  /**
   * @param {number} id
   * @returns {Npc | undefined}
   */
  getNpcById(id) {
    const npc = this._npcs.find(npc => npc.id === id);

    return npc;
  }

  /**
   * @param {TerritoryCoordinate[]} coordinates
   * @returns {Position2D}
   */
  _getRandomPos(coordinates) {
    /** @type {number[]} */
    let xp = coordinates.map(i => i.x);
    /** @type {number[]} */
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

  /**
   * @param {number[]} xp
   * @param {number[]} yp
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
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

