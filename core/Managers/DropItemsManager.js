const database = require('./../../database');
const DropItem = require('./../Models/DropItem');
/** @typedef {import('./../Models/Item')} Item */

class DropItemsManager {
  constructor() {
    /** @type {DropItem[]} */
    this._items = [];
  }

  /**
   * @param {Item} item
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Promise<DropItem>}
   */
  async createDropItem(item, x, y, z) {
    const objectId = await database.getNextObjectId();
    const dropItem = new DropItem(objectId, item.getItemId(), item.getCount(), item, x, y, z);

    return dropItem;
  }
}

module.exports = new DropItemsManager();