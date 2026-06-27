const Character = require('./Character');
const MoveState = require('./../states/MoveState');
const IdleState = require('./../states/IdleState');
const AttackState = require('./../states/AttackState');
const CastState = require('./../states/CastState');
const FollowState = require('./../states/FollowState');
const PickupState = require('./../states/PickupState');
const TalkState = require('./../states/TalkState');
//
const npcManager = require('./../Managers/NpcManager');
//

/** @typedef {{ x: number | null, y: number | null, z: number | null }} PathPoint */
/** @typedef {{ target: PathPoint, origin: PathPoint }} Path */

class Bot extends Character {
  /** @param {import('../Client')} client */
  constructor(client) {
    super();

    /** @type {import('../Client')} */
    this._client = client;
    /** @type {import('./Character') | null} */
    this.target = null;
    /** @type {number} */
    this.positionUpdateTimestamp = 0;
    /** @type {'move' | 'idle' | 'attack' | 'cast' | 'follow' | 'pickup' | 'talk' | ''} */
    this.state = '';
    /** @type {'move' | 'attack' | 'pickup' | ''} */
    this.action = '';
    /** @type {boolean} */
    this.isMoving = false;
    /** @type {boolean} */
    this.isAttacking = false;
    /** @type {boolean} */
    this.isCasting = false;
    /** @type {boolean} */
    this.isDead = false;

    /** @type {Record<'move' | 'idle' | 'attack' | 'cast' | 'follow' | 'pickup' | 'talk', import('../states/BaseState') & { payload?: unknown }>} */
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
    /** @type {unknown | null} */
    this.pickupItem = null; // хранить objectId? как target?
    /** @type {{ name?: string, script: string }} */
    this.ai = {
      script: 'DefaultBot'
    };
    /** @type {number} */
    this.lastAttackTimestamp = 0;
    /** @type {number} */
    this.castTimestamp = 0;
    /** @type {number} */
    this.lastRegenerateTimestamp = 0;
    /** @type {number} */
    this.baseAttackSpeed = 300; // TODO
    //
    /** @type {unknown | null} */
    this._actionPayload = null;
    //
    /** @type {number} */
    this.lastUpdateTimestamp = 0;
    /** @type {boolean} */
    this.isDamage = false;
    /** @type {number} */
    this.moveType = 1;
    /** @type {number} */
    this.waitType = 1;
    /** @type {import('../states/BaseState') | ''} */
    this._currentState = '';
    /** @type {import('./Item') | null} */
    this._activeWeapon = null;
    //
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

    // this.doAction('move', path);
    // this.emit('move');

    // const spawnedNpcs = npcManager.getSpawnedNpcs();

    // this.target = spawnedNpcs[Math.floor(Math.random() * spawnedNpcs.length)].objectId;

    // setTimeout(() => {
    //   this.doAction('attack', this.target);
    // }, 10000)

    //this.ai.name
    const RunningBot = require('./../../datapack/ai/bot/RunningBot');
    const runningBot = new RunningBot();

    runningBot.created();

    runningBot.on('run', /** @param {number} x @param {number} y */ (x, y) => {
      /** @type {Path} */
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

      this.doAction('move', path);
      //this.emit('move');
    });
  }

  /** @returns {import('../Client')} */
  getClient() {
    return this._client;
  }

  /** @param {unknown} payload */
  setActionPayload(payload) {
    this._actionPayload = payload;
  }

  /** @returns {unknown | null} */
  getActionPayload() {
    return this._actionPayload;
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
   * @param {'move' | 'idle' | 'attack' | 'cast' | 'follow' | 'pickup' | 'talk'} stateName
   * @param {unknown} payload
   */
  changeState(stateName, payload) {
    if (this._currentState) {
      this._currentState.leave();
    }

    const state = this._states[stateName];

    state.payload = payload; // remove
    this._currentState = state;
    
    state.enter();
  }

  update() {
    this.lastUpdateTimestamp = Date.now();

    if (this._currentState) {
      this._currentState.update();
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

  // create math utils
  /** @returns {[number, number]} */
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

module.exports = Bot;