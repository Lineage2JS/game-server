class Item {
  constructor(data) {
    this._objectId = null;
    this._itemId = data.itemId;
    this._name = data.name;
    this._bodyPart = data.bodyPart;
    this._type1 = data.type1;
    this._type2 = data.type2;
    this._weight = data.weight;
    this._price = data.price;
    this._count = 1;
    this._isEquipped = false;
  }

  getObjectId() {
    return this._objectId;
  }

  setObjectId(objectId) {
    this._objectId = objectId;
  }

  getItemId() {
    return this._itemId;
  }

  getName() {
    return this._name;
  }

  getBodyPart() {
    return this._bodyPart;
  }

  getType1() {
    return this._type1;
  }

  getType2() {
    return this._type2;
  }

  getWeight() {
    return this._weight;
  }

  getPrice() {
    return this._price;
  }

  getCount() {
    return this._count;
  }

  setCount(count) {
    return this._count = count;
  }

  equip() {
    this._isEquipped = true;
  }

  unEquip() {
    this._isEquipped = false;
  }

  get isEquipped() {
    return this._isEquipped;
  }

  // get isEquippable() {
  //   if (this.equipSlot !== 'none') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }


  // updateCount(value) {
  //   this._count = value;
  // }
}

module.exports = Item;