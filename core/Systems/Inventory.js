/** @typedef {import('../Models/Item')} Item */

class Inventory {
  constructor() {
    /** @type {Item[]} */
    this._items = [];
  }

  /**
   * @param {Item} item
   * @returns {void}
   */
  addItem(item) {
    if (!item.isStackable) {
      this._items.push(item);

      return;
    }

    const foundItem = this._items.find(i => i.getItemId() === item.getItemId());

    if (!foundItem) {
      this._items.push(item);

      return;
    }

    foundItem.setCount(foundItem.getCount() + item.getCount());
  }

  /**
   * @returns {Item[]}
   */
  getItems() {
    return this._items;
  }
}

module.exports = Inventory;