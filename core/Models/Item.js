/**
 * @typedef {object} ItemData
 * @property {number} itemId
 * @property {string} name
 * @property {number} bodyPart
 * @property {number} type1
 * @property {number} type2
 * @property {number} weight
 * @property {number} price
 * @property {boolean} [stackable]
 */

class Item {
  /**
   * @param {ItemData} data
   */
  constructor(data) {
    /** @type {number | null} */
    this._objectId = null;
    /** @type {number} */
    this._itemId = data.itemId;
    /** @type {string} */
    this._name = data.name;
    /** @type {number} */
    this._bodyPart = data.bodyPart;
    /** @type {number} */
    this._type1 = data.type1;
    /** @type {number} */
    this._type2 = data.type2;
    /** @type {number} */
    this._weight = data.weight;
    /** @type {number} */
    this._price = data.price;
    /** @type {boolean} */
    this._stackable = data.stackable || false;
    /** @type {number} */
    this._count = 1;
    /** @type {boolean} */
    this._isEquipped = false;
  }

  /** @returns {number | null} */
  getObjectId() {
    return this._objectId;
  }

  /** @param {number} objectId */
  setObjectId(objectId) {
    this._objectId = objectId;
  }

  /** @returns {number} */
  getItemId() {
    return this._itemId;
  }

  /** @returns {string} */
  getName() {
    return this._name;
  }

  /** @returns {number} */
  getBodyPart() {
    return this._bodyPart;
  }

  /** @returns {number} */
  getType1() {
    return this._type1;
  }

  /** @returns {number} */
  getType2() {
    return this._type2;
  }

  /** @returns {number} */
  getWeight() {
    return this._weight;
  }

  /** @returns {number} */
  getPrice() {
    return this._price;
  }

  /** @returns {number} */
  getCount() {
    return this._count;
  }

  /** @param {number} count */
  setCount(count) {
    return this._count = count;
  }

  /** @returns {boolean} */
  getStackable() {
    return this._stackable;
  }

  /** @returns {void} */
  equip() {
    this._isEquipped = true;
  }

  /** @returns {void} */
  unEquip() {
    this._isEquipped = false;
  }

  /** @returns {boolean} */
  get isEquipped() {
    return this._isEquipped;
  }

  /** @returns {boolean} */
  get isStackable() {
    return this._stackable;
  }

  /** @returns {boolean} */
  get isEquipable() {
    if (this._bodyPart !== 0) { // TODO SLOT_NONE
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Item;