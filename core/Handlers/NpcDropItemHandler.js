const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/itemsManager');
const dropItemsManager = require('./../Managers/dropItemsManager');
const entitiesManager = require('./../Managers/EntitiesManager');
const serverPackets = require('./../ServerPackets/serverPackets');

class NpcDropItemHandler {
  async handle(data) {
    const npc = data.character;

    if (npc.additionalMakeMultiList.length === 0) {
      return;
    }

    const dropItems = []

    npc.additionalMakeMultiList.forEach(list => {
      const randomChanceGroup = Math.floor(Math.random() * 100);

      if (randomChanceGroup > list.chance) {
        return;
      }

      list.group.forEach(item => {
        const randomChanceItem = Math.floor(Math.random() * 100);

        if (randomChanceItem > item.chance) {
          return;
        }

        const count = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        const dropItem = {
          itemName: item.itemName,
          count,
        }

        dropItems.push(dropItem);
      });
    });

    console.log(npc.id, dropItems);

    for (let i = 0; i < dropItems.length; i++) {
      const dropItem = dropItems[i];
      const itemId = itemsManager.getItemIdByName(dropItem.itemName);
      const itemCount = dropItem.count;
      const createdItem = await itemsManager.createItem(itemId, itemCount);
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 30;
      const droppedItemX = Math.floor(npc.x + Math.cos(angle) * distance);
      const droppedItemY = Math.floor(npc.y + Math.sin(angle) * distance);
      const droppedItem = await dropItemsManager.createDropItem(createdItem, droppedItemX, droppedItemY, npc.z + 300);

      entitiesManager.addEntity(droppedItem);
      playersManager.emit('notify', new serverPackets.DropItem(npc, {
        objectId: droppedItem.objectId,
        itemId: droppedItem.itemId,
        itemCount: droppedItem.itemCount,
        x: droppedItem.x,
        y: droppedItem.y,
        z: droppedItem.z
      }));
    }
  }
}

module.exports = NpcDropItemHandler;