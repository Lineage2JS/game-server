const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/ItemsManager');
const dropItemsManager = require('./../Managers/DropItemsManager');
const entitiesManager = require('./../Managers/EntitiesManager');
const serverPackets = require('./../ServerPackets/serverPackets');

/** @typedef {import('./../Models/Npc')} Npc */
/** @typedef {{ itemName: string, chance: number, min: number, max: number }} DropGroupItem */
/** @typedef {{ chance: number, group: DropGroupItem[] }} DropGroup */
/** @typedef {{ additionalMakeMultiList: DropGroup[], id: number, x: number, y: number, z: number }} NpcWithDropList */
/** @typedef {{ character: NpcWithDropList }} NpcDropItemEvent */
/** @typedef {{ itemName: string, count: number }} DropItemData */

class NpcDropItemHandler {
  /**
   * @param {NpcDropItemEvent} data
   * @returns {Promise<void>}
   */
  async handle(data) {
    /** @type {NpcWithDropList} */
    const npc = data.character;

    if (npc.additionalMakeMultiList.length === 0) {
      return;
    }

    /** @type {DropItemData[]} */
    const dropItems = []

    /** @param {DropGroup} list */
    npc.additionalMakeMultiList.forEach(list => {
      const randomChanceGroup = Math.floor(Math.random() * 100);

      if (randomChanceGroup > list.chance) {
        return;
      }

      /** @param {DropGroupItem} item */
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
      /** @type {DropItemData} */
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