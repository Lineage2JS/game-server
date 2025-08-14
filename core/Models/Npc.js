const Character = require('./Character');

//
const movingManager = require('./../Managers/MovingManager');
const entitiesManager = require('./../Managers/EntitiesManager'); // fix?

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

    this.state = '';
    this.job = '';
    this.isAttacking = false;
    this.isMoving = false;
    this.isRunning = false;

    this.baseAttackSpeed = null;
    this.getMagicalSpeed = 333; // fix
    
    //
    this.lastTimeTick = 0;
    this.coordinates = null;
    //

    //
    this.additionalMakeMultiList = [];
    this.ai = null;
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
    this.updateState('move', path);
  }

  updatePosition(tick) {
    if (!this.isMoving) {
      this.lastTimeTick = Date.now();
      this.isMoving = true;
    }

    const dx = this.path.target.x - this.x;
    const dy = this.path.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) - 10;
    const time = (tick  - this.lastTimeTick) / 1000;
    let dist;
    
    if (distance < ((this.isRunning ? this.runSpeed : this.walkSpeed) / 10)) { // fix
      dist = distance;

      const path = {
        target: {
          x: this.path.target.x,
          y: this.path.target.y,
          z: -3115
        },
        origin: {
          x: this.x,
          y: this.y,
          z: this.z
        }
      }
  
      const angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);
  
      this.updateParams({
        x: this.x + (Math.cos(angle) * dist), // забирается из вне. Значение стирается
        y: this.y + (Math.sin(angle) * dist),
        z: this.z
      });
  
      this.lastTimeTick = tick;

      this.emit('updatePosition');
      this.updateState('stop');
    }

    dist = (this.isRunning ? this.runSpeed : this.walkSpeed) * time;

    const path = {
      target: {
        x: this.path.target.x,
        y: this.path.target.y,
        z: -3115
      },
      origin: {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    const angle = Math.atan2(path.target.y - path.origin.y, path.target.x - path.origin.x);

    this.updateParams({
      x: this.x + (Math.cos(angle) * dist),
      y: this.y + (Math.sin(angle) * dist),
      z: this.z
    });

    this.lastTimeTick = tick;

    this.emit('updatePosition');
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
    }
  }

  attack(objectId) {
    if (this.job !== 'attack') {
      return; // fix?
    }

    //  for updateJob
    this.isRunning = true;
    this.emit('changeMove');
    //

    const entity = entitiesManager.getEntityByObjectId(objectId);
    const path = {
      target: {
        x: entity.x,
        y: entity.y,
        z: entity.z
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
    const distance = Math.sqrt(dx * dx + dy * dy) - 40;

    if (distance > 50) {
      this.updateState('follow', this.path);

      return;
    }
    
    // fix
    if (entity.hp <= 0) {
      this.job = 'patrol';
      this.updateState('stop');
      
      return;
    }
    //

    this.emit('attack', objectId);

    setTimeout(() => {
      this.updateState('attack', this.target);
    }, 500000 / 273);
  }

  follow(path) {
    this.move(path);

    function tick() {
      if (this.state !== 'follow') {
        return;
      }
      
      const entity = entitiesManager.getEntityByObjectId(this.target);

      this.path.origin.x = this.x;
      this.path.origin.y = this.y;
      this.path.target.x = entity.x;
      this.path.target.y = entity.y;

      const p = moveCloser(this.path.origin.x, this.path.origin.y, this.path.target.x, this.path.target.y, 40);

      this.path.target.x = p.x;
      this.path.target.y = p.y;

      this.emit('move'); // fix all emit. notifyAction()?

      if (this.state === 'follow') {
        setTimeout(tick.bind(this), 100);
      }
    }

    tick.bind(this)();
  }
  
  move(path) {
    this.path = path;
    this.lastTimeTick = Date.now(); // lastTimestampUpdatePosition

    movingManager.registerMovingObject(this);

    this.emit('move'); // fix
  }

  stop() {
    movingManager.unregisterMovingObject(this);

    this.emit('stop');

    if (this.job === 'patrol') {
      setTimeout(() => {
        if (this.job !== 'patrol') {
          return;
        }

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

        this.updateState('move', path);
      }, 15000);
    }

    if (this.job === 'attack') {
      this.updateState('attack', this.target);
    }
  }

  update() {
    
  }

  updateParams(data) {
    for(const key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
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