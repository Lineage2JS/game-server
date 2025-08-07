const Character = require('./Character');
const serverPackets = require('./../ServerPackets/serverPackets');

//
const database = require('./../../database');
const movingManager = require('./../Managers/MovingManager');
const npcManager = require('./../Managers/NpcManager');
const itemsManager = require('../Managers/ItemsManager');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
let objectId;
//

function moveCloser(x1, y1, x2, y2, distance) {
  // Вычисляем разницу между координатами
  let dx = x2 - x1;
  let dy = y2 - y1;

  // Вычисляем расстояние между точками
  let dist = Math.sqrt(dx * dx + dy * dy);

  // Нормализуем вектор разницы
  let nx = dx / dist;
  let ny = dy / dist;

  // Перемещаем точку (x2, y2) ближе на заданное расстояние
  let newX = x2 - nx * distance;
  let newY = y2 - ny * distance;

  return { x: newX, y: newY };
}

class Bot extends Character {
  constructor(client) {
    super();

    this._client = client;
    this.target = null;
    this.positionUpdateTimestamp = 0;
    this.state = '';
    this.job = '';
    this.isMoving = false;
    this.isAttacking = false;

    //
    this.pickupItem = null; // хранить objectId? как target?
    this.ai = {
      script: 'DefaultBot'
    };
    //

    this._init();
  }

  async _init() {
    objectId = await database.getNextObjectId();
  }

  enable() {
    // const positions = this._getRandomPos();

    // let path = {
    //   target: {
    //     x: positions[0],
    //     y: positions[1],
    //     z: -3115
    //   },
    //   origin: {
    //     x: this.x,
    //     y: this.y,
    //     z: this.z
    //   }
    // }

    // this.updateJob('move', path);
    // this.emit('move');

    // const spawnedNpcs = npcManager.getSpawnedNpcs();

    // this.target = spawnedNpcs[Math.floor(Math.random() * spawnedNpcs.length)].objectId;

    // setTimeout(() => {
    //   this.updateJob('attack', this.target);
    // }, 10000)

    //this.ai.script
    const RunningBot = require('./../../Data/ai/bot/RunningBot');
    const runningBot = new RunningBot();

    runningBot.created();

    runningBot.on('move', (x, y) => {
      let path = {
        target: {
          x: x,
          y: y,
          z: -3115
        },
        origin: {
          x: this.x,
          y: this.y,
          z: this.z
        }
      }

      this.updateJob('move', path);
      this.emit('move');
    });
  }

  getClient() {
    return this._client;
  }

  updateJob(job, payload) {
    this.job = job;

    switch(job) {
      case 'move':
        this.updateState('move', payload);
        
        break;
      case 'attack':
        this.updateState('attack', payload);

        break;
      case 'pickup':
        this.pickupItem = payload;
        this.updateState('pickup');

        break;
    }
  }

  updateState(state, payload) {
    this.state = state;

    //console.log(` --- bot ${this.characterName} state`, state);

    switch(state) {
      case 'move':
        this.move(payload);
        
        break;
      case 'follow':
        this.follow(payload);

        break;
      case 'attack':
        this.attack(payload);

        break;
      case 'stop':
        this.stop();

        break;
      case 'pickup':
        this.pickup();

        break;
    }
  }

  move(path) {
    this.path = path;

    if (!this.isMoving) {
      movingManager.registerMovingObject(this);

      this.positionUpdateTimestamp = Date.now();
      this.isMoving = true;
    }

    // cancel job if change job. Stop attack if attack => move;
    if (this.job === 'move') {
      this.isAttacking = false;
    }
  }

  follow(path) { // objectId // наверное надо в follow переместить updateState('stop') а не в updatePosition хранить
    this.move(path);
    this.emit('move')

    function tick() {
      if (this.state !== 'follow') {
        return;
      }
      
      const npc = npcManager.getNpcByObjectId(this.target);

      this.path.origin.x = this.x;
      this.path.origin.y = this.y;
      this.path.target.x = npc.x;
      this.path.target.y = npc.y;

      const p = moveCloser(this.path.origin.x, this.path.origin.y, this.path.target.x, this.path.target.y, 20);

      this.path.target.x = p.x;
      this.path.target.y = p.y;

      this.emit('move');

      if (this.state === 'follow') {
        setTimeout(tick.bind(this), 100);
      }
    }

    tick.bind(this)();
  }

  attack(objectId) {
    if (this.job !== 'attack') {
      return; // fix?
    }

    const npc = npcManager.getNpcByObjectId(objectId);
    const path = {
      target: {
        x: npc.x,
        y: npc.y,
        z: npc.z
      },
      origin: {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    this.path = path;

    const dx = this.path.target.x - this.x;
    const dy = this.path.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 20;

    if (distance > 29) { // 29 - attack range + collision radius
      this.updateState('follow', this.path);

      return;
    }

    this.emit('attack');

    if (npc.job === 'patrol') {
      setTimeout(() => {
        npc.job = 'attack';
        npc.target = this.objectId;
        npc.updateState('stop'); // attack, if attack = stop > attack or follow
      }, 500000 / 330 / 2);
    }

    if (npc.hp >= 0) {
      setTimeout(() => {
        npc.hp = npc.hp - 10;

        //
        if (npc.hp <= 0) {
          npc.job = 'dead';
          npc.updateState('stop');
          npc.emit('died');
          
          //
          setTimeout(() => {
            const lastItem = itemsManager._items[itemsManager._items.length - 1];

            this.updateJob('pickup', lastItem);
          }, 1000);
          //
          this.target = null;
          this.isAttacking = false;
    
          setTimeout(() => {
            this._client.sendPacket(new serverPackets.AutoAttackStop(this.objectId));
          }, 3000);
    
          return;
        }
        //

        this._client.sendPacket(new serverPackets.StatusUpdate(objectId, [
          {
            id: characterStatusEnums.CUR_HP,
            value: npc.hp,
          },
          {
            id: characterStatusEnums.MAX_HP,
            value: npc.maximumHp,
          }
        ]));
      }, 500000 / 330 / 2);
  
      setTimeout(() => {
        if (npc.hp <= 0) {
          this._client.sendPacket(new serverPackets.AutoAttackStop(this.objectId));

          return;
        }

        this.updateState('attack', this.target);
      }, 500000 / 330);
    }
  }

  stop() {
    movingManager.unregisterMovingObject(this);
    
    this.isMoving = false;

    // fix дождатся остановки перемещения(удаления из таймера)
    setTimeout(() => {
      if (this.job === 'attack') {
        this.updateState('attack', this.target);
      }

      if (this.job === 'pickup') {
        this.updateState('pickup');
      }

      // if (this.job === 'move') {
      //   const positions = this._getRandomPos();

      //   let path = {
      //     target: {
      //       x: positions[0],
      //       y: positions[1],
      //       z: -3115
      //     },
      //     origin: {
      //       x: this.x,
      //       y: this.y,
      //       z: this.z
      //     }
      //   }

      //   this.updateState('move', path);
      //   this.emit('move');
      // }
    }, 200);
  }

  pickup() {
    const path = {
      target: {
        x: this.pickupItem.x,
        y: this.pickupItem.y,
        z: this.pickupItem.z
      },
      origin: {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    this.path = path;

    const dx = this.path.target.x - this.x;
    const dy = this.path.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) { // fix?
      this.updateState('move', this.path);
      this.emit('move');

      return;
    }

    this.emit('pickup', this.pickupItem); //fix?

    setTimeout(() => {
      const spawnedNpcs = npcManager.getSpawnedNpcs();

      this.target = spawnedNpcs[Math.floor(Math.random() * spawnedNpcs.length)].objectId;

      this.updateJob('attack', this.target);
    }, 2000);
  }

  update(data) { // remove
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  updateParams(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  updatePosition(tick) {
    const dx = this.path.target.x - this.x;
    const dy = this.path.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 9;
    const time = (tick  - this.positionUpdateTimestamp) / 1000;
    
    if (distance < (this.runSpeed / 10)) {  
      const angle = Math.atan2(this.path.target.y - this.path.origin.y, this.path.target.x - this.path.origin.x);

      this.update({
        x: parseFloat((this.x + (Math.cos(angle) * distance)).toFixed(1)),
        y: parseFloat((this.y + (Math.sin(angle) * distance)).toFixed(1)),
        z: this.z
      });
  
      this.positionUpdateTimestamp = tick;

      this.updateState('stop');

      return;
    }

    const step = this.runSpeed * time;
    const angle = Math.atan2(this.path.target.y - this.path.origin.y, this.path.target.x - this.path.origin.x);

    this.update({
      x: parseFloat((this.x + (Math.cos(angle) * step)).toFixed(1)),
      y: parseFloat((this.y + (Math.sin(angle) * step)).toFixed(1)),
      z: this.z
    });

    this.positionUpdateTimestamp = tick;
  }

  // create math utils
  _getRandomPos() {
    let max = { x: -80000, y: 270000 };
    let min = { x: -60000, y: 250000 };
    let xp = [-71988, -71390, -72283, -72895];
    let yp = [256706, 257435, 258192, 257464];
    let x;
    let y;
      
    do {
      x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
      y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
    } while(!this._inPoly(xp, yp, x, y))

    return [x, y]
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
  //
}

module.exports = Bot;