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
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (this.slot === 0x0400) {
      const item = player.getItemByObjectId(player.chest.objectId);
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (this.slot === 0x0800) {
      const item = player.getItemByObjectId(player.legs.objectId);
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (this.slot === 0x0200) { // SLOT_GLOVES
      const item = player.getItemByObjectId(player.gloves.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    if (this.slot === 0x1000) { // SLOT_FEET
      const item = player.getItemByObjectId(player.feet.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    if (this.slot === 0x0040) { // SLOT_HEAD
      const item = player.getItemByObjectId(player.head.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    if (this.slot === 0x4000) { // SLOT_LR_HAND
      const item = player.getItemByObjectId(player.hand.leftAndRight.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.ItemList(player.getItems()));
  }
}

module.exports = RequestUnEquipItem;