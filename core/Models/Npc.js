const Character = require('./Character');
const MoveState = require('./../states/MoveState');
const IdleState = require('./../states/IdleState');
const AttackState = require('./../states/AttackState');
const FollowState = require('./../states/FollowState');
const PickupState = require('./../states/PickupState');
const DeadState = require('./../states/DeadState');
const itemNamesMap = require('../../datapack/itemNamesMap.json');

/** @typedef {{ x: number, y: number, z: number }} Point3D */
/** @typedef {{ x: number, y: number }} Point2D */
/** @typedef {import('./Character').CharacterTemplate & { name: string, type: string, id: number, level: number, baseAttackRange: number, baseRunSpeed: number, baseWalkSpeed: number, baseDefend: number, baseAttackSpeed: number, baseCritical: number, canBeAttacked: number, aggressive?: number, collisionRadius: number, collisionHeight: number, slotRhand: string, slotLhand: string }} NpcData */

/**
 * @param {string} itemName
 * @returns {number} itemId - returns 0 if itemName is not found
 */
function getItemIdByName(itemName) {
  if (!itemName || typeof itemName !== 'string') {
    return 0;
  }

  const foundItemId = itemNamesMap[/** @type {keyof typeof itemNamesMap} */(itemName)];

  if (foundItemId) {
    return foundItemId;
  }

  return 0;
}

class Npc extends Character {
  /**
   * @param {NpcData} npcData
   */
  constructor(npcData) {
    super(npcData);

    /** @type {number} */
    this.id = npcData.id;
    /** @type {string} */
    this.name = npcData.name;
    /** @type {string} */
    this.type = npcData.type;
    /** @type {number} */
    this.baseAttackRange = npcData.baseAttackRange;
    /** @type {number} */
    this.canBeAttacked = npcData.canBeAttacked;
    /** @type {number} */
    this.aggressive = npcData.aggressive || 0;
    /** @type {number} */
    this.rightHand = getItemIdByName(npcData.slotRhand);
    /** @type {number} */
    this.leftHand = getItemIdByName(npcData.slotLhand);
    /** @type {number | null} */
    this.armor = null;
    /** @type {string | null} */
    this.class = null;
    /** @type {number} */
    this.collisionRadius = npcData.collisionRadius;
    /** @type {number} */
    this.collisionHeight = npcData.collisionHeight;
    /** @type {number} */
    this.baseRunSpeed = npcData.baseRunSpeed || 0;
    /** @type {number} */
    this.baseWalkSpeed = npcData.baseWalkSpeed || 0;

    /** @type {{ move: import('../states/BaseState'), idle: import('../states/BaseState'), attack: import('../states/BaseState'), follow: import('../states/BaseState'), pickup: import('../states/BaseState'), dead: import('../states/BaseState') }} */
    this._states = {
      'move': new MoveState(this),
      'idle': new IdleState(this),
      'attack': new AttackState(this),
      'follow': new FollowState(this),
      'pickup': new PickupState(this),
      'dead': new DeadState(this),
    }

    /** @type {'move' | 'idle' | 'attack' | 'follow' | 'pickup' | 'dead' | ''} */
    this.state = '';
    /** @type {'move' | 'attack' | 'pickup' | 'patrol' | ''} */
    this.action = '';
    /** @type {boolean} */
    this.isAttacking = false;
    /** @type {boolean} */
    this.isMoving = false;
    /** @type {boolean} */
    this.isRunning = false;

    /** @type {number} */
    this.baseAttackSpeed = 330;
    /** @type {number} */
    this.getMagicalSpeed = 333; // fix

    //
    /** @type {Point2D[] | null} */
    this.coordinates = null;

    /** @type {number} */
    this.lastAttackTimestamp = 0;

    //
    /** @type {unknown[]} */
    this.additionalMakeMultiList = [];
    /** @type {* | null} */
    this.ai = null;

    /** @type {number} */
    this.positionUpdateTimestamp = 0;
    /** @type {number} */
    this.lastRegenerateTimestamp = 0;
    /** @type {number} */
    this.lastUpdateTimestamp = 0;
    /** @type {import('../states/BaseState') | ''} */
    this._currentState = '';
    //
  }

  get isDead() {
    return this.state === 'dead';
  }

  enable() {
    if (!this.coordinates) {
      return;
    }

    //
    const positions = this._getRandomPos(this.coordinates);

    const path = {
      target: {
        x: positions[0],
        y: positions[1],
        z: this.z
      },
      origin: {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    this.action = 'patrol';

    // setTimeout(() => { // lastUpdateTimestamp срабатывает через 100мс после добавление в EntitiesManager иначе npc идет на млрд расстояния
    //   this.action = 'patrol';
    //   this.changeState('move', path);
    // }, 15000);
  }

  /**
   * @param {'move' | 'attack' | 'pickup'} action
   * @param {unknown} payload
   */
  doAction(action, payload) {
    this.action = action;

    switch(action) {
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

  /**
   * @param {'move' | 'idle' | 'attack' | 'follow' | 'pickup' | 'dead'} stateName
    * @param {unknown} [payload]
   */
  changeState(stateName, payload) {
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

    if (this.hp > 0 && this.hp < this.maximumHp && !this.isDead) {
      this.regenerate();
    }

    if (this.hp <= 0 && !this.isDead) {
      this.changeState('dead');
    }
  }

  regenerate() {
    if ((Date.now() - this.lastRegenerateTimestamp) > 3000) {
      this.hp += 1;
      this.lastRegenerateTimestamp = Date.now();

      this.emit('regenerate');
    }
  }

  // create math utils
  /** @param {Point2D[]} coordinates */
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

		return [x, y]
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
  //
}

module.exports = Npc;