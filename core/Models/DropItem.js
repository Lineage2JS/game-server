class DropItem {
  constructor(objectId, itemId, item, x, y, z) {
    this.objectId = objectId;
    this.itemId = itemId;
    this.x = x;
    this.y = y;
    this.z = z;
    this._item = item;
  }

  getItem() {
    return this._item;
  }
}

module.exports = DropItem;