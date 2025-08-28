const Character = require('./Character');
const Inventory = require('./../Systems/Inventory');
const Quests = require('./../Systems/Quests');
const MoveState = require('./../states/MoveState');
const StopState = require('./../states/StopState');
const AttackState = require('./../states/AttackState');
const FollowState = require('./../states/FollowState');
const PickupState = require('./../states/PickupState');

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

    this._states = {
      'move': new MoveState(this),
      'stop': new StopState(this),
      'attack': new AttackState(this),
      'follow': new FollowState(this),
      'pickup': new PickupState(this),
    }

    //
    this._inventory = new Inventory();
    this._quests = new Quests();
    this.lastTalkedNpcId = null;
    this.pickupItem = null; // хранить objectId? как target?
    this._activeSoulShot = false;
    this.lastAttackTimestamp = 0;
    this.lastRegenerateTimestamp = 0;
    this.baseAttackSpeed = 330
    //
    this.payloadAttack = null; // fix

    this.lastUpdateTimestamp = 0;
    this.isDamage = false;
    this.moveType = 1;
    this.waitType = 1;
    this._currentState = '';
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
        this.changeState('move', payload);
        
        break;
      case 'attack':
        this.changeState('attack', payload);

        break;
      case 'pickup':
        this.pickupItem = payload;
        this.changeState('pickup', payload);

        break;
    }
  }

  changeState(stateName, payload) {
    if (this._currentState) {
      this._currentState.leave();
    }

    const state = this._states[stateName];

    state.payload = payload;
    this._currentState = state;
    
    state.enter();
  }

  update() {
    this.lastUpdateTimestamp = Date.now();

    if (this._currentState) {
      this._currentState.update();
    }
    
    if ((Date.now() - this.lastAttackTimestamp) > 5000) {
      this.emit('endAttack');
    }

    if (this.hp < this.maximumHp) {
      this.regenerate(); 
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

      this.changeState('stop');

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
    if ((Date.now() - this.lastRegenerateTimestamp) > 3000) {
      this.hp += 1;
      this.lastRegenerateTimestamp = Date.now();

      this.emit('regenerate');
    }
  }
}

module.exports = Player;