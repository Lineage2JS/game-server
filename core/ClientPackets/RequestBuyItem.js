const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/ItemsManager');
const npcManager = require('./../Managers/NpcManager');
const ItemEtc = require('./../Models/ItemEtc');

class RequestBuyItem {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get listId() {
    return this._data.getData()[0];
  }

  get countItems() {
    return this._data.getData()[1];
  }

  get itemId() {
    return this._data.getData()[2];
  }

  get itemCount() { // fix?
    return this._data.getData()[3];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const item = await itemsManager.createItem(this.itemId);

    if (player.getAdenaCount() < item.getPrice()) {
      this._client.sendPacket(new serverPackets.SystemMessage(279))

      return;
    }

    if (item instanceof ItemEtc) {
      if (item.isStackable) {
        item.setCount(this.itemCount);
      }
    }

    player.addItem(item);

    const items = player.getItems();

    this._client.sendPacket(new serverPackets.ItemList(items, true));

    const npc = npcManager.getNpcById(player.lastTalkedNpcId);

    npc.ai.talk(player); // TODO тут ли вызывать?
  }
}

module.exports = RequestBuyItem;