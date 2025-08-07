const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestDestroyItem {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD();

    this._init();
  }

  get objectId() {
    return this._data.getData()[0];
  }

  get count() {
    return this._data.getData()[1];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const item = player.getItemByObjectId(this.objectId);

    player.deleteItemByObjectId(item.objectId);

    this._client.sendPacket(new serverPackets.ItemList(player.getItems()));
  }
}

module.exports = RequestDestroyItem;