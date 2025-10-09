class Inventory {
  constructor() {
    this._items = [];
  }

  addItem(item) {  
    this._items.push(item);
  }

  getItems() {
    return this._items;
  }
}

module.exports = Inventory;