const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestItemList {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }


  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const items = player.getItems();

    this._client.sendPacket(new serverPackets.ItemList(items, true));
  }
}

module.exports = RequestItemList;