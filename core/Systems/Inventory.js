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

  getAdenaCount() {
    const item = this._items.find(item => item.getItemId() === 57); // TODO const ?

    if (!item) {
      return 0;
    }

    return item.getCount();
  }
}

module.exports = Inventory;