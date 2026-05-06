const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const itemsManager = require('./../Managers/ItemsManager');
const npcManager = require('./../Managers/NpcManager');
const ItemEtc = require('./../Models/ItemEtc');

class RequestBuyItem extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const listId = this.readD();
    const countItems = this.readD();
    const itemId = this.readD();
    const itemCount = this.readD();

    // for (let i = 0; i < countItems; i++) {
    //   const itemId = this.readD();
    //   const itemCount = this.readD();
    // }

    const item = await itemsManager.createItem(itemId);

    if (player.getAdenaCount() < item.getPrice()) {
      client.sendPacket(new serverPackets.SystemMessage(279))

      return;
    }

    // if (item instanceof ItemEtc) {
    //   if (item.isStackable) {
    //     item.setCount(itemCount);
    //   }
    // }

    player.reduceAdena(item.getPrice());
    player.addItem(item);

    const items = player.getItems();

    client.sendPacket(new serverPackets.ItemList(items, true));

    // TODO тут можно вызывать eventBus с успешной покупкой
    const npc = npcManager.getNpcByObjectId(player.lastTalkedNpcId);

    npc.ai.talk(player);
  }
}

module.exports = RequestBuyItem;