const EventEmitter = require('events');
const Npc = require('./../Models/Npc');
const npcTable = require('./../tables/NpcTable');
const spawnTable = require('./../tables/SpawnTable');
const database = require('./../../database');
const ai = require('./../../datapack/ai');
const { getRandomPointInPolygon } = require('./../../utils/geometry');

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
      const { spawnGroup, spawnPoints } = spawnData;
      const npcData = npcTable.getNpcByName(spawnGroup.name);

      for(let j = 0; j < spawnGroup.total; j++) {
        await this.spawnNpc(npcData, spawnId, spawnGroup, spawnPoints);
        this._showSpawnedNpcCount();
      } 
    }

    process.stdout.write(`\n`);
  }

  async spawnNpc(npcData, spawnId, spawnGroup, spawnPoints) {
    const npc = await this._createNpc(npcData, spawnId, spawnGroup, spawnPoints);
    
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

  async _createNpc(npcData, spawnId, spawnGroup, spawnPoints) {
    const npc = new Npc();

    npc.type = npcData.type;
    npc.id = npcData.id;
    npc.name = npcData.name;
    npc.level = npcData.level;
    npc.exp = npcData.exp;
    npc.canBeAttacked = npcData.canBeAttacked;
    npc.additionalMakeMultiList = npcData.additionalMakeMultiList;
    npc.hp = npcData.hp;
    npc.mp = npcData.mp;

    npc.baseAttackRange = npcData.baseAttackRange;
    npc.baseWalkSpeed = npcData.baseWalkSpeed;
    npc.baseRunSpeed = npcData.baseRunSpeed;
    npc.baseAttackSpeed = npcData.baseAttackSpeed;
    npc.collisionRadius = npcData.collisionRadius;
    npc.collisionHeight = npcData.collisionHeight;
    
    npc.getCombatStats().setPDef(npcData.baseDefend);
    npc.objectId = await database.getNextObjectId();
    npc.maxHp = npc.hp;
    npc.setCharacterName(npcData.name);
    npc.setSpawnId(spawnId);
    this._bindNpcEvents(npc);
    this._setupPositions(npc, spawnGroup, spawnPoints);
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
    });
  }

  _setupPositions(npc, spawnGroup, spawnPoints) {
    if (spawnGroup.pos === 'anywhere') {
      const [x, y] = getRandomPointInPolygon(spawnPoints);

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

  _setupAi(npc, npcData) {
    const AiInstance = ai[npcData.ai.name];

    if (AiInstance) {
      const ai = new AiInstance(npcData.ai.props);

      npc.setAi(ai);
    }
  }

  _showSpawnedNpcCount() {
    process.stdout.write(`\r[NPS] ${this._npcs.size}`);
  }
}

module.exports = new NpcManager();

