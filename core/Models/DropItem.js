class DropItem {
  /**
   * @param {number} objectId
   * @param {number} itemId
   * @param {number} itemCount
   * @param {import('./Item')} item
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(objectId, itemId, itemCount, item, x, y, z) {
    /** @type {number} */
    this.objectId = objectId;
    /** @type {number} */
    this.itemId = itemId;
    /** @type {number} */
    this.itemCount = itemCount;
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.z = z;
    /** @type {import('./Item')} */
    this._item = item;
  }

  /** @returns {import('./Item')} */
  getItem() {
    return this._item;
  }
}

module.exports = DropItem;