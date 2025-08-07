const database = require('./../../database');
const DropItem = require('./../Models/DropItem');

class DropItemsManager {
  constructor() {
    this._items = [];
  }

  async createDropItem(item, x, y, z) {
    const objectId = await database.getNextObjectId();
    const dropItem = new DropItem(objectId, item.itemId, item, x, y, z);

    return dropItem;
  }
}

module.exports = new DropItemsManager();