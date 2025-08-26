const Character = require('./Character');
const MoveState = require('./../states/MoveState');
const StopState = require('./../states/StopState');
const AttackState = require('./../states/AttackState');
const FollowState = require('./../states/FollowState');
const PickupState = require('./../states/PickupState');

//
//const movingManager = require('./../Managers/MovingManager');
//const entitiesManager = require('./../Managers/EntitiesManager'); // fix?

//
// function moveCloser(x1, y1, x2, y2, distance) {
//   // Вычисляем разницу между координатами
//   let dx = x2 - x1;
//   let dy = y2 - y1;

//   // Вычисляем расстояние между точками
//   let dist = Math.sqrt(dx * dx + dy * dy);

//   // Нормализуем вектор разницы
//   let nx = dx / dist;
//   let ny = dy / dist;

//   // Перемещаем точку (x2, y2) ближе на заданное расстояние
//   let newX = x2 - nx * distance;
//   let newY = y2 - ny * distance;

//   return { x: newX, y: newY };
// }
//

class Npc extends Character {
  constructor() {
    super();

    this.id = null;
    this.name = null;
    this.type = null;
    this.baseAttackRange = null;
    this.canBeAttacked = null;
    this.aggressive = null;
    this.rightHand = null;
    this.leftHand = null;
    this.armor = null;
    this.class = null;
    this.collisionRadius = null;
    this.collisionHeight = null;
    this.baseRunSpeed = 0;
    this.baseWalkSpeed = 0;

    this._states = {
      'move': new MoveState(this),
      'stop': new StopState(this),
      'attack': new AttackState(this),
      'follow': new FollowState(this),
      'pickup': new PickupState(this),
    }

    this.state = '';
    this.job = '';
    this.isAttacking = false;
    this.isMoving = false;
    this.isRunning = false;

    this.baseAttackSpeed = 330;
    this.getMagicalSpeed = 333; // fix
    
    //
    this.lastTimeTick = 0;
    this.coordinates = null;

    this.lastAttackTimestamp = 0;
    //
    this.payloadAttack = null; // fix
    //

    //
    this.additionalMakeMultiList = [];
    this.ai = null;

    this.positionUpdateTimestamp = 0;
    this.lastRegenerateTimestamp = 0;
    this.lastUpdateTimestamp = 0;
    this.isDamage = false;
    this._currentState = '';
    //
  }

  get runSpeed() {
    return this.baseRunSpeed * 1.1;
  }

  get walkSpeed() {
    return this.baseWalkSpeed * 1.1;
  }

  async enable() {
    //
    const positions = this._getRandomPos(this.coordinates);

    let path = {
      target: {
        x: positions[0],
        y: positions[1],
        z: -3115
      },
      origin: {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }
    
    this.job = 'patrol';
    //this.changeState('move', path);
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

  update() { // remove
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

  // create math utils
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