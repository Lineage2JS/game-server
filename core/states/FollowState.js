const BaseState = require("./BaseState");

//
const entitiesManager = require('./../Managers/EntitiesManager');
const { calculateDistance } = require('./../../utils/distance');
//

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} distance
 * @returns {{ x: number, y: number }}
 */
function moveCloser(x1, y1, x2, y2, distance) {
  // Вычисляем разницу между координатами
  let dx = x2 - x1;
  let dy = y2 - y1;

  // Вычисляем расстояние между точками
  let dist = calculateDistance({ x: x1, y: y1 }, { x: x2, y: y2 });

  // cannot divide by zero, return something reasonable
  if (dist === 0) {
    return { x: x2, y: y2 };
  }

  // Нормализуем вектор разницы
  let nx = dx / dist;
  let ny = dy / dist;

  // Перемещаем точку (x2, y2) ближе на заданное расстояние
  let newX = x2 - nx * distance;
  let newY = y2 - ny * distance;

  return { x: newX, y: newY };
}

class FollowState extends BaseState {
  /** @returns {Promise<void>} */
  async enter() {
    /** @type {number | null} */
    this.originX = null;
    /** @type {number | null} */
    this.originY = null;
    /** @type {number | null} */
    this.originZ = null;
    /** @type {number | null} */
    this.targetX = null;
    /** @type {number | null} */
    this.targetY = null;
    /** @type {number | null} */
    this.targetZ = null;
  }

  /** @returns {void} */
  update() {
    const entity = entitiesManager.getEntityByObjectId(this.character.targetCharacterId);

    this.originX = this.character.x;
    this.originY = this.character.y;
    this.originZ = this.character.z;
    this.targetX = entity.x;
    this.targetY = entity.y;
    this.targetZ = entity.z;

    let range = 20;

    if (this.character.action === 'talk') {
      range = 80;
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

  /** @returns {void} */
  leave() {
    
  }
}

module.exports = FollowState;