class Inventory {
  constructor() {
    this._items = [];
  }

  addItem(item) {
    if (item.isStackable) {
      const foundItem = this._items.find(i => i.itemId === item.itemId);

      if (foundItem) {
        foundItem.updateCount(foundItem.getCount() + 1);
      } else {
        this._items.push(item);
      }

      return;
    }
  
    this._items.push(item);
  }

  getItems() {
    return this._items;
  }
}

module.exports = Inventory;