const Character = require('./Character');
const Inventory = require('./../Systems/Inventory');
const Quests = require('./../Systems/Quests');
const Skills = require('./../Systems/Skills');
const MoveState = require('./../states/MoveState');
const IdleState = require('./../states/IdleState');
const AttackState = require('./../states/AttackState');
const CastState = require('./../states/CastState');
const FollowState = require('./../states/FollowState');
const PickupState = require('./../states/PickupState');
const TalkState = require('./../states/TalkState');
const CastPayload = require('./../payloads/CastPayload');

class Player extends Character {
  constructor() {
    super();

    this._client = null;
    this.target = null;
    this.positionUpdateTimestamp = 0;
    this.state = '';
    this.action = '';
    this.isMoving = false;
    this.isDead = false;

    this._states = {
      'move': new MoveState(this),
      'idle': new IdleState(this),
      'attack': new AttackState(this),
      'cast': new CastState(this),
      'follow': new FollowState(this),
      'pickup': new PickupState(this),
      'talk': new TalkState(this),
    }

    //
    this._inventory = new Inventory();
    this._quests = new Quests();
    this._skills = new Skills();
    this.lastTalkedNpcId = null; // TODO сделать _lastTalkedNpcId а запрос через getter
    this.pickupItem = null; // хранить objectId? как target?
    this._activeSoulShot = false;
    this.lastAttackTimestamp = 0;
    this.lastMoveTimestamp = 0;
    this.castTimestamp = 0;
    this.lastRegenerateTimestamp = 0;
    this.baseAttackSpeed = 300; // TODO
    this.actionParams = {
      targetX: null,
      targetY: null,
      targetZ: null,
      targetId: null,
      itemId: null,
      skillId: null,
    }
    this.lastUpdateTimestamp = 0;
    this.isDamage = false;
    this.moveType = 1;
    this.waitType = 1;
    this._currentState = '';
    this._activeWeapon = null;
    //
  }

  get targetX() {
    return this.actionParams.targetX;
  }

  get targetY() {
    return this.actionParams.targetY;
  }

  get targetZ() {
    return this.actionParams.targetZ;
  }

  get targetId() {
    return this.actionParams.targetId;
  }

  get itemId() {
    return this.actionParams.itemId;
  }

  get skillId() {
    return this.actionParams.skillId;
  }

  get timeSinceLastAttack() {
    return Date.now() - this.lastAttackTimestamp;
  }

  get attackDelay() {
    return 500000 / this.attackSpeed;
  }

  get isAttacking() {
    return this.state === 'attack';
  }

  get isCasting() {
    return this.state === 'cast';
  }

  getClient() {
    return this._client;
  }

  setClient(client) {
    this._client = client;
  }

  setActionPayload(payload) {
    this._actionPayload = payload;
  }

  getActionPayload() {
    return this._actionPayload;
  }

  // setLastTalkedNpcId(npcId) {
  //   this.lastTalkedNpcId = npcId; // TODO лучше хранить objectId?
  // }

  // getLastTalkedNpcId() {
  //   return this.lastTalkedNpcId;
  // }

  // isState(state) {
  //   return this.getState() === stateName;
  // }

  // isDead() {
  //   return this.isState('dead');
  // }

  getSkills() {
    return this._skills.getSkills();
  }

  addSkill(skill) {
    this._skills.addSkill(skill)
  }

  setActiveWeapon(item) { // делать запрос через activeWeapon проверяя this.hand...
    this._activeWeapon = item;
  }

  getActiveWeapon() {
    return this._activeWeapon;
  }

  getAdenaCount() {
    const items = this._inventory.getItems();
    const item = items.find(item => item.getItemId() === 57); // TODO const ?

    if (!item) {
      return 0;
    }

    return item.getCount();
  }

  reduceAdena(adenaCount) {
    const items = this._inventory.getItems();
    const item = items.find(item => item.getItemId() === 57);

    if (!item) {
      return;
    }

    const currentAdenaCount = item.getCount();

    if (currentAdenaCount > adenaCount) {
      item.setCount(currentAdenaCount - adenaCount);
    }
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
    const foundItem = items.find(item => item.getObjectId() === objectId);

    if (foundItem) {
      return foundItem;
    } else {
      return null;
    }
  }

  deleteItemByName(itemName) { // TODO deleteItem, удалять по ID и сделать 1 метод вместо 2-х? или только по ObjectId
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.itemName === itemName);

    if (foundItem) {
      const index = items.indexOf(foundItem);

      items.splice(index, 1);
    }
  }

  deleteItemByObjectId(objectId, count = 1) {
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.getObjectId() === objectId);

    if (!foundItem) {
      return
    }

    if (!foundItem.isStackable) {
      const index = items.indexOf(foundItem);

      items.splice(index, 1);

      return;
    }

    if (foundItem.getCount() > count) {
      const currentCount = foundItem.getCount();

      foundItem.setCount(currentCount - count);

      return;
    }

    if (foundItem.getCount() === count) {
      const index = items.indexOf(foundItem);

      items.splice(index, 1);

      return;
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

  doAction(action, ...payload) {
    this.action = action;

    switch(action) {
      case 'move':
        this.actionParams = { targetX: payload[0], targetY: payload[1], targetZ: payload[2] };
        this.changeState('move');
        
        break;
      case 'attack':
        this.actionParams = { targetId: payload[0] };
        this.changeState('attack');

        break;
      case 'pickup':
        this.actionParams = { itemId: payload[0] };
        this.changeState('pickup');

        break;
      case 'cast':
        this.actionParams = { targetId: payload[0], skillId: payload[1] };
        this.changeState('cast');

        break;
      case 'talk':
        this.actionParams = { targetId: payload[0] };
        this.changeState('talk');

        break;
    }
  }

  clearAction() {
    this.action = null;
    this.actionParams = {
      targetX: null,
      targetY: null,
      targetZ: null,
      targetId: null,
      itemId: null,
      skillId: null,
    }
  }

  changeState(stateName) {
    if (this._currentState) {
      this._currentState.leave();
    }
    
    const state = this._states[stateName];

    this.state = stateName;
    this._currentState = state;

    this._currentState.enter();
  }

  update() {
    this.lastUpdateTimestamp = Date.now();

    if (this._currentState) {
      this._currentState.update();
    }
    
    if ((Date.now() - this.lastAttackTimestamp) > 5000) {
      this.emit('endAttack');
    }

    if (this.hp < this.maximumHp || this.mp < this.maximumMp) {
      this.regenerate(); 
    }

    if (this.hp <= 0 && this.action !== 'dead') {
      this.hp = 0;
      this.action = 'dead';
      this.changeState('idle');
      this.emit('died');
      this.isDead = true;
      this.target = null;
    }
  }

  updateParams(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  moveTo(targetX, targetY, targetZ) {
    if (this.lastMoveTimestamp === 0) {
      this.lastMoveTimestamp = Date.now();
    }

    const now = Date.now();
    const delta = (now - this.lastMoveTimestamp) / 1000;
    const step = this.runSpeed * delta;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 9;

    this.lastMoveTimestamp = now;

    if (distance < 10) {
      this.x = targetX;
      this.y = targetY;
      this.lastMoveTimestamp = 0;
      
      return true;
    }

    const angle = Math.atan2(dy, dx);

    this.x += Math.cos(angle) * step;
    this.y += Math.sin(angle) * step;

    return false;
  }

  attack(entity) {
    entity.emit('attacked', {
      attacker: this,
      damage: 10 // TODO
    });
  }

  regenerate() {
    if ((Date.now() - this.lastRegenerateTimestamp) > 3000) {
      if (this.hp < this.maximumHp) {
        this.hp += 1;
      }
      
      if (this.mp < this.maximumMp) {
        this.mp += 1;
      }
      
      this.lastRegenerateTimestamp = Date.now();

      this.emit('regenerate');
    }
  }

  equipItem(item) {
    const slot = item.getBodyPart();

    if (slot === 0x0080) { // SLOT_R_HAND
      const itemEquippedLeftAndRight = this.getItemByObjectId(this.hand.leftAndRight.objectId);

      if (itemEquippedLeftAndRight) {
        itemEquippedLeftAndRight.unEquip();
      }

      this.hand.leftAndRight.objectId = 0;
      this.hand.leftAndRight.itemId = 0;
      
      const itemEquippedRight = this.getItemByObjectId(this.hand.right.objectId);

      if (itemEquippedRight) {
        itemEquippedRight.unEquip();
      }

      this.hand.right.objectId = item.getObjectId();
      this.hand.right.itemId = item.getItemId();

      this.setActiveWeapon(item);
    }

    if (slot === 0x0100) { // SLOT_L_HAND
      const itemEquippedLeftAndRight = this.getItemByObjectId(this.hand.leftAndRight.objectId);

      if (itemEquippedLeftAndRight) {
        itemEquippedLeftAndRight.unEquip();
      }

      this.hand.leftAndRight.objectId = 0;
      this.hand.leftAndRight.itemId = 0;
      
      const itemEquippedLeft = this.getItemByObjectId(this.hand.left.objectId);

      if (itemEquippedLeft) {
        itemEquippedLeft.unEquip();
      }

      this.hand.left.objectId = item.getObjectId();
      this.hand.left.itemId = item.getItemId();

      this.setActiveWeapon(item);
    }

    if (slot === 0x0400) { // SLOT_CHEST
      const itemEquipped = this.getItemByObjectId(this.chest.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.chest.objectId = item.getObjectId();
      this.chest.itemId = item.getItemId();
    }

    if (slot === 0x0800) { // SLOT_LEGS
      const itemEquipped = this.getItemByObjectId(this.legs.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.legs.objectId = item.getObjectId();
      this.legs.itemId = item.getItemId();
    }

    if (slot === 0x0200) { // SLOT_GLOVES
      const itemEquipped = this.getItemByObjectId(this.gloves.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.gloves.objectId = item.getObjectId();
      this.gloves.itemId = item.getItemId();
    }

    if (slot === 0x1000) { // SLOT_FEET
      const itemEquipped = this.getItemByObjectId(this.feet.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.feet.objectId = item.getObjectId();
      this.feet.itemId = item.getItemId();
    }

    if (slot === 0x0040) { // SLOT_HEAD
      const itemEquipped = this.getItemByObjectId(this.head.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.head.objectId = item.getObjectId();
      this.head.itemId = item.getItemId();
    }

    if (slot === 0x4000) { // SLOT_LR_HAND
      const itemEquippedLeft = this.getItemByObjectId(this.hand.left.objectId);

      if (itemEquippedLeft) {
        itemEquippedLeft.unEquip();
      }

      this.hand.left.objectId = 0;
      this.hand.left.itemId = 0;

      const itemEquippedRight = this.getItemByObjectId(this.hand.right.objectId);

      if (itemEquippedRight) {
        itemEquippedRight.unEquip();
      }

      this.hand.right.objectId = 0;
      this.hand.right.itemId = 0;

      const itemEquippedLeftAndRight = this.getItemByObjectId(this.hand.leftAndRight.objectId);

      if (itemEquippedLeftAndRight) {
        itemEquippedLeftAndRight.unEquip();
      }

      this.hand.leftAndRight.objectId = item.getObjectId();
      this.hand.leftAndRight.itemId = item.getItemId();

      this.setActiveWeapon(item);
    }

    item.equip();
  }

  unEquipItem(item) {
    const slot = item.getBodyPart();
    
    if (slot === 0x0080) { // SLOT_R_HAND
      this.hand.right.objectId = 0;
      this.hand.right.itemId = 0;

      this.setActiveWeapon(null);
    }

    if (slot === 0x0100) { // SLOT_L_HAND
      this.hand.left.objectId = 0;
      this.hand.left.itemId = 0;

      this.setActiveWeapon(null);
    }

    if (slot === 0x4000) { // SLOT_LR_HAND
      this.hand.leftAndRight.objectId = 0;
      this.hand.leftAndRight.itemId = 0;

      this.setActiveWeapon(null);
    }

    if (slot === 0x0400) { // SLOT_CHEST
      this.chest.objectId = 0;
      this.chest.itemId = 0;
    }

    if (slot === 0x0800) { // SLOT_LEGS
      this.legs.objectId = 0;
      this.legs.itemId = 0;
    }

    item.unEquip();
  }
}

module.exports = Player;