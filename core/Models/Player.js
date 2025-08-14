const Character = require('./Character');
const serverPackets = require('./../ServerPackets/serverPackets');
const characterStatusEnums = require('./../../enums/characterStatusEnums');
const levelExpTable = require('./../data/exp.json');
const Inventory = require('./../Systems/Inventory');
const Quests = require('./../Systems/Quests');

//
const npcManager = require('./../Managers/NpcManager');
const aiManager = require('./../Managers/AiManager');
//

function findLevel(exp) { // оптимизировать get level by exp
  let level = 1;
  
  // Перебираем уровни, пока не найдем нужный
  for (let i = 1; i <= 60; i++) {
    if (exp >= levelExpTable[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  return level;
}

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

class Player extends Character {
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
    this._inventory = new Inventory();
    this._quests = new Quests();
    this.lastTalkedNpcId = null;
    this.pickupItem = null; // хранить objectId? как target?
    this._activeSoulShot = false;
    //
  }

  getClient() {
    return this._client;
  }

  setActiveSoulShot() {
    this._activeSoulShot = true;
  }

  addItem(item) {
    this._inventory.addItem(item);
  }

  getItems() {
    return this._inventory.getItems();
  }

  getItemByObjectId(objectId) {
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.objectId === objectId);

    if (foundItem) {
      return foundItem;
    }
  }

  deleteItemByName(itemName) {
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.itemName === itemName);

    if (foundItem) {
      const index = items.indexOf(foundItem);

      items.splice(index, 1);
    }
  }

  deleteItemByObjectId(objectId) {
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.objectId === objectId);

    if (foundItem) {
      const index = items.indexOf(foundItem);

      items.splice(index, 1);
    }
  }

  addQuest(id) {
    this._quests.addQuest(id);
  }

  deleteQuestById(questId) {
    const quests = this._quests.getQuests();
    const foundItem = quests.find(quest => quest.id === questId);

    if (foundItem) {
      const index = quests.indexOf(foundItem);

      quests.splice(index, 1);
    }
  }

  getQuests() {
    return this._quests.getQuests();
  }

  updateJob(job, payload) {
    this.job = job;

    switch(job) {
      case 'move':
        this.updateState('move', payload);
        this._client.sendPacket(new serverPackets.MoveToLocation(payload, this.objectId));
        
        break;
      case 'attack':
        this.updateState('attack', payload); // IPayloadAttack ? instanceof

        break;
      case 'pickup':
        this.pickupItem = payload;
        this.updateState('pickup');

        break;
    }
  }

  updateState(state, payload) {
    this.state = state;

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
      this.emit('startedMoving');

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

      this._client.sendPacket(new serverPackets.MoveToLocation(this.path, this.objectId));

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
    
    this.lastAttackTimestamp = Date.now();

    this._client.sendPacket(new serverPackets.Attack(this, npc.objectId, this._activeSoulShot));

    this._activeSoulShot = false;

    if (npc.job === 'patrol') {
      setTimeout(() => {
        npc.job = 'attack';
        npc.target = this.objectId;
        npc.updateState('stop'); // attack, if attack = stop > attack or follow

        { // fix test
          aiManager.onAttacked(npc, npc.ai.name, this);
        }
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
          npc.emit('dropItems');

          this.exp += 100;
          this.emit('updateExp');

          {
            const level = findLevel(this.exp);
            
            if (this.level < level) {
              this.level = level;

              this.emit('updateLevel');
            }
          }

          { // fix test
            aiManager.onMyDying(npc.ai.name, this);
          }
          
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
    //movingManager.unregisterMovingObject(this); // fix надо дожидаться
    this.emit('endMoving');
    
    this.isMoving = false;

    // fix дождатся остановки перемещения(удаления из таймера)
    setTimeout(() => {
      if (this.job === 'attack') {
        this.updateState('attack', this.target);
      }

      if (this.job === 'pickup') {
        this.updateState('pickup');
      }
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
  }

  update() { // remove
    if ((Date.now() - this.lastAttackTimestamp) > 5000) {
      this.emit('endAttack');
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

      this.updateParams({
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

    this.updateParams({
      x: parseFloat((this.x + (Math.cos(angle) * step)).toFixed(1)),
      y: parseFloat((this.y + (Math.sin(angle) * step)).toFixed(1)),
      z: this.z
    });

    this.positionUpdateTimestamp = tick;

    this.emit('move'); // ?
  }

  regenerate() {
    if (this.hp < this.maximumHp) {
      this.hp += 1;

      this.emit('regenerate');
    }
  }
}

module.exports = Player;