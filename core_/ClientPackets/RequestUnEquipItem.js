const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestUnEquipItem {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get slot() {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.slot === 0x0080) {
      const item = player.getItemByObjectId(player.hand.right.objectId);
      
      item.toggleEquip();

      player.hand.right.objectId = 0;
      player.hand.right.itemId = 0;

      this._client.sendPacket(new serverPackets.ItemList(player.getItems()));
    }
  }
}

module.exports = RequestUnEquipItem;