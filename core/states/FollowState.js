const BaseState = require("./BaseState");

//
const entitiesManager = require('./../Managers/EntitiesManager');
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

class FollowState extends BaseState {
  async enter() {
    this.originX = null;
    this.originY = null;
    this.originZ = null;
    this.targetX = null;
    this.targetY = null;
    this.targetZ = null;
  }

  update() {
    const entity = entitiesManager.getEntityByObjectId(this.character.target);

    this.originX = this.character.x;
    this.originY = this.character.y;
    this.originZ = this.character.z;
    this.targetX = entity.x;
    this.targetY = entity.y;
    this.targetZ = entity.z;

    let range = 20;

    if (this.character.action === 'talk') {
      range = 100;
    }

    if (this.character.action === 'attack') {
      range = 20;
    }

    if (this.character.action === 'cast') {
      range = 600;
    }

    const p = moveCloser(this.originX, this.originY, this.targetX, this.targetY, range);

    this.targetX = p.x;
    this.targetY = p.y;

    const arrived = this.character.moveTo(this.targetX, this.targetY, this.targetZ);

    if (arrived) {
      this.character.changeState('idle');
      
      return;
    }

    this.character.emit('move', this.targetX, this.targetY, this.targetZ);
  }

  leave() {
    
  }
}

module.exports = FollowState;