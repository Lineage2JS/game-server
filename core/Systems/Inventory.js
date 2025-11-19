class Inventory {
  constructor() {
    this._items = [];
  }

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

  getItems() {
    return this._items;
  }
}

module.exports = Inventory;