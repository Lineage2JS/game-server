const Character = require('./Character');
const MoveState = require('./../states/MoveState');
const IdleState = require('./../states/IdleState');
const AttackState = require('./../states/AttackState');
const FollowState = require('./../states/FollowState');
const PickupState = require('./../states/PickupState');
const DeadState = require('./../states/DeadState');

/** @typedef {{ x: number, y: number, z: number }} Point3D */
/** @typedef {{ x: number, y: number }} Point2D */

class Npc extends Character {
  constructor() {
    super();

    /** @type {number | null} */
    this.id = null;
    /** @type {string | null} */
    this.name = null;
    /** @type {string | null} */
    this.type = null;
    /** @type {number | null} */
    this.baseAttackRange = null;
    /** @type {boolean | null} */
    this.canBeAttacked = null;
    /** @type {boolean | null} */
    this.aggressive = null;
    /** @type {number | null} */
    this.rightHand = null;
    /** @type {number | null} */
    this.leftHand = null;
    /** @type {number | null} */
    this.armor = null;
    /** @type {string | null} */
    this.class = null;
    /** @type {number | null} */
    this.collisionRadius = null;
    /** @type {number | null} */
    this.collisionHeight = null;
    /** @type {number} */
    this.baseRunSpeed = 0;
    /** @type {number} */
    this.baseWalkSpeed = 0;

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
    /** @type {unknown | null} */
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

  /** @param {Record<string, unknown>} data */
  updateParams(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        Reflect.set(this, key, data[key]);
      }
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