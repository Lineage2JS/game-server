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
const { getRandomPointInPolygon } = require('./../../utils/geometry');

class Bot extends Character {
  constructor(client) {
    super();

    this._client = client;
    this.target = null;
    this.state = '';
    this.action = '';
    this.isMoving = false;
    this.isAttacking = false;
    this.isCasting = false;
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
    this.pickupItem = null; // хранить objectId? как target?
    this.ai = {
      script: 'DefaultBot'
    };
    this.lastAttackTimestamp = 0;
    this.castTimestamp = 0;
    this.lastRegenerateTimestamp = 0;
    this.baseAttackSpeed = 300; // TODO
    //
    this._actionPayload = null;
    //
    this.lastUpdateTimestamp = 0;
    this.isDamage = false;
    this.moveType = 1;
    this.waitType = 1;
    this._currentState = '';
    this._activeWeapon = null;
    //
  }

  enable() {
    // const positions = this.getRandomPointInPolygon(); // TODO empty args
    // let max = { x: -80000, y: 270000 };
    // let min = { x: -60000, y: 250000 };
    // let xp = [-71988, -71390, -72283, -72895];
    // let yp = [256706, 257435, 258192, 257464];

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

    runningBot.on('run', (x, y) => {
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

  getClient() {
    return this._client;
  }

  setActionPayload(payload) {
    this._actionPayload = payload;
  }

  getActionPayload() {
    return this._actionPayload;
  }

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
}

module.exports = Bot;