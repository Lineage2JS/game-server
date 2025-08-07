class Item {
  constructor(objectId, itemId, consume_type, item_type, itemName, equipSlot) {
    this.objectId = objectId;
    this.itemId = itemId;
    this.consumeType = consume_type;
    this.itemType = item_type;
    this.itemName = itemName;
    this.equipSlot = equipSlot;
    this._count = 1;
    this._equipped = false;
  }

  get isStackable() {
    if (this.consumeType === 'consume_type_stackable' || this.consumeType === 'consume_type_asset') {
      return true;
    } else {
      return false;
    }
  }

  get isEquippable() {
    if (this.equipSlot !== 'none') {
      return true;
    } else {
      return false;
    }
  }

  get isEquipped() {
    return this._equipped;
  }

  get isQuestItem() {
    if (this.itemType === 'questitem') {
      return true;
    } else {
      return false;
    }
  }

  toggleEquip() {
    this._equipped = !this._equipped;
  }

  getCount() {
    return this._count;
  }

  updateCount(value) {
    this._count = value;
  }
}

module.exports = Item;