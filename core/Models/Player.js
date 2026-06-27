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
const { calculateDistance } = require('./../../utils/distance');
const equipmentSlots = require('../../enums/equipmentSlotEnums');

class Player extends Character {
  constructor() {
    super();

    /** @type {import('../Client') | null} */
    this._client = null;
    /** @type {import('./Character') | null} */
    this.target = null;
    /** @type {string} */
    this._stateName = '';
    /** @type {string | null} */
    this.action = '';

    /** @type {Record<string, import('../states/BaseState')>} */
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
    /** @type {Inventory} */
    this._inventory = new Inventory();
    /** @type {Quests} */
    this._quests = new Quests();
    /** @type {Skills} */
    this._skills = new Skills();
    /** @type {number | null} */
    this.lastTalkedNpcId = null; // TODO сделать _lastTalkedNpcId а запрос через getter
    /** @type {boolean} */
    this._activeSoulShot = false;
    /** @type {number} */
    this.lastAttackTimestamp = 0;
    /** @type {number} */
    this.lastMoveTimestamp = 0;
    /** @type {number} */
    this.castTimestamp = 0;
    /** @type {number} */
    this.lastRegenerateTimestamp = 0;
    /** @type {number} */
    this.baseAttackSpeed = 300; // TODO

    /** @type {number} */
    this.moveType = 1;
    /** @type {number} */
    this.waitType = 1;
    /** @type {import('../states/BaseState') | null} */
    this._currentState = null;
    /** @type {import('./Item') | null} */
    this._activeWeapon = null;
    //
  }

  get timeSinceLastAttack() {
    return Date.now() - this.lastAttackTimestamp;
  }

  get attackDelay() {
    return 500000 / this.attackSpeed;
  }

  get isAttacking() {
    return this._stateName === 'attack';
  }

  get isCasting() {
    return this._stateName === 'cast';
  }

  /**
   * @returns {import('../Client') | null}
   */
  getClient() {
    return this._client;
  }

  /**
   * @param {import('../Client')} client
   */
  setClient(client) {
    this._client = client;
  }

  // setLastTalkedNpcId(npcId) {
  //   this.lastTalkedNpcId = npcId; // TODO лучше хранить objectId?
  // }

  // getLastTalkedNpcId() {
  //   return this.lastTalkedNpcId;
  // }

  getSkills() {
    return this._skills.getSkills();
  }

  /** @param {{ skillId: number, skillLevel: number }} skill */
  addSkill(skill) {
    this._skills.addSkill(skill)
  }

  getActiveWeapon() {
    return this._activeWeapon;
  }

  /** @param {import('./Item') | null} item */
  setActiveWeapon(item) { // делать запрос через activeWeapon проверяя this.hand...
    this._activeWeapon = item;
  }

  getAdenaCount() {
    const items = this._inventory.getItems();
    const item = items.find(item => item.getItemId() === 57); // TODO const ?

    if (!item) {
      return 0;
    }

    return item.getCount();
  }

  /** @param {number} adenaCount */
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

  /** @param {import('./Item')} item */
  addItem(item) {
    this._inventory.addItem(item);
  }

  getItems() {
    return this._inventory.getItems();
  }

  /** @param {number} objectId */
  getItemByObjectId(objectId) {
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.getObjectId() === objectId);

    if (foundItem) {
      return foundItem;
    } else {
      return null;
    }
  }

  /** @param {string} itemName */
  deleteItemByName(itemName) { // TODO deleteItem, удалять по ID и сделать 1 метод вместо 2-х? или только по ObjectId
    const items = this._inventory.getItems();
    const foundItem = items.find(item => item.getName() === itemName);

    if (foundItem) {
      const index = items.indexOf(foundItem);

      items.splice(index, 1);
    }
  }

  /**
   * @param {number} objectId
   * @param {number} [count=1]
   */
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

  /** @param {number} id */
  addQuest(id) {
    this._quests.addQuest(id);
  }

  /** @param {number} questId */
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

  /**
   * @param {'move' | 'attack' | 'pickup' | 'cast' | 'talk'} action
   * @param {...number} payload
   */
  doAction(action, ...payload) {
    this.action = action;

    switch(action) {
      case 'move':
        this.targetX = payload[0];
        this.targetY = payload[1];
        this.targetZ = payload[2];
        this.changeState('move');
        
        break;
      case 'attack':
        this.targetCharacterId = payload[0];
        this.changeState('attack');

        break;
      case 'pickup':
        this.targetItemId = payload[0];
        this.changeState('pickup');

        break;
      case 'cast':
        this.targetCharacterId = payload[0];
        this.targetSkillId = payload[1];
        this.changeState('cast');

        break;
      case 'talk':
        this.targetCharacterId = payload[0];
        this.changeState('talk');

        break;
    }
  }

  clearAction() {
    this.action = null;
    this.targetX = null;
    this.targetY = null;
    this.targetZ = null;
    this.targetCharacterId = null;
    this.targetItemId = null;
    this.targetSkillId = null;
  }

  /** @param {'move' | 'idle' | 'attack' | 'cast' | 'follow' | 'pickup' | 'talk'} stateName */
  changeState(stateName) {
    if (this._currentState) {
      this._currentState.leave();
    }

    this._stateName = stateName;
    this._currentState = this._states[stateName];

    this._currentState.enter();
  }

  update() {
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

  /** @param {Record<string, unknown>} data */
  updateParams(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        Reflect.set(this, key, data[key]);
      }
    }
  }

  /**
   * @param {number} targetX
   * @param {number} targetY
   * @param {number} targetZ
   * @returns {boolean}
   */
  moveTo(targetX, targetY, targetZ) {
    if (this.lastMoveTimestamp === 0) {
      this.lastMoveTimestamp = Date.now();
    }

    const now = Date.now();
    const delta = (now - this.lastMoveTimestamp) / 1000;
    const step = this.runSpeed * delta;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = calculateDistance({ x: targetX, y: targetY }, { x: this.x, y: this.y }) - 9;

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

  /** @param {import('./Character')} entity */
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

  /** @param {import('./Item')} item */
  equipItem(item) {
    const slot = item.getBodyPart();

    if (slot === equipmentSlots.SLOT_R_HAND) {
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

    if (slot === equipmentSlots.SLOT_L_HAND) {
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

    if (slot === equipmentSlots.SLOT_CHEST) {
      const itemEquipped = this.getItemByObjectId(this.chest.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.chest.objectId = item.getObjectId();
      this.chest.itemId = item.getItemId();
    }

    if (slot === equipmentSlots.SLOT_LEGS) {
      const itemEquipped = this.getItemByObjectId(this.legs.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.legs.objectId = item.getObjectId();
      this.legs.itemId = item.getItemId();
    }

    if (slot === equipmentSlots.SLOT_GLOVES) {
      const itemEquipped = this.getItemByObjectId(this.gloves.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.gloves.objectId = item.getObjectId();
      this.gloves.itemId = item.getItemId();
    }

    if (slot === equipmentSlots.SLOT_FEET) {
      const itemEquipped = this.getItemByObjectId(this.feet.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.feet.objectId = item.getObjectId();
      this.feet.itemId = item.getItemId();
    }

    if (slot === equipmentSlots.SLOT_HEAD) {
      const itemEquipped = this.getItemByObjectId(this.head.objectId);

      if (itemEquipped) {
        itemEquipped.unEquip();
      }

      this.head.objectId = item.getObjectId();
      this.head.itemId = item.getItemId();
    }

    if (slot === equipmentSlots.SLOT_LR_HAND) {
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

  /** @param {import('./Item')} item */
  unEquipItem(item) {
    const slot = item.getBodyPart();
    
    if (slot === equipmentSlots.SLOT_R_HAND) {
      this.hand.right.objectId = 0;
      this.hand.right.itemId = 0;

      this.setActiveWeapon(null);
    }

    if (slot === equipmentSlots.SLOT_L_HAND) {
      this.hand.left.objectId = 0;
      this.hand.left.itemId = 0;

      this.setActiveWeapon(null);
    }

    if (slot === equipmentSlots.SLOT_LR_HAND) {
      this.hand.leftAndRight.objectId = 0;
      this.hand.leftAndRight.itemId = 0;

      this.setActiveWeapon(null);
    }

    if (slot === equipmentSlots.SLOT_CHEST) {
      this.chest.objectId = 0;
      this.chest.itemId = 0;
    }

    if (slot === equipmentSlots.SLOT_LEGS) {
      this.legs.objectId = 0;
      this.legs.itemId = 0;
    }

    item.unEquip();
  }
}

module.exports = Player;