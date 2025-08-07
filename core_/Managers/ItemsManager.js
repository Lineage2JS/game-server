const database = require('./../../database');
const Item = require('./../Models/Item');
const itemsList = require('./../../Data/itemsList.json');

class ItemsManager {
  async createItemByName(itemName) {
    const itemData = itemsList.find(i => i.name === itemName);

    const objectId = await database.getNextObjectId();
    const item = new Item(objectId, itemData.id, itemData.consume_type, itemData.item_type, itemData.name, itemData.slot_bit_type);

    return item;
  }

  async createItemById(itemId) {
    const itemData = itemsList.find(i => i.id === itemId);

    const objectId = await database.getNextObjectId();
    const item = new Item(objectId, itemData.id, itemData.consume_type, itemData.item_type, itemData.name, itemData.slot_bit_type);

    return item;
  }
}

module.exports = new ItemsManager();