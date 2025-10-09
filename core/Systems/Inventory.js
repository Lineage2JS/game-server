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

  getAdenaCount() {
    const item = this._items.find(item => item.getItemId() === 57); // TODO const ?

    if (!item) {
      return 0;
    }

    return item.getCount();
  }
}

module.exports = Inventory;