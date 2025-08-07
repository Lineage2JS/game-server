const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/ItemsManager');

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
    const item = await itemsManager.createItemById(this.itemId);

    player.addItem(item);
  }
}

module.exports = RequestBuyItem;