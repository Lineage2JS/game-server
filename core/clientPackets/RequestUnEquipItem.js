const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const equipmentSlots = require('../../enums/equipmentSlotEnums');

class RequestUnEquipItem extends ClientPacketNew {
  static code = 0x11;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const slot = this.readD();

    if (!player) return;

    // TODO Переработать систему с слотами и убрать magic numbers
    if (slot === equipmentSlots.SLOT_R_HAND) {
      const item = player.getItemByObjectId(player.hand.right.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === equipmentSlots.SLOT_L_HAND) {
      const item = player.getItemByObjectId(player.hand.left.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === equipmentSlots.SLOT_CHEST) {
      const item = player.getItemByObjectId(player.chest.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === equipmentSlots.SLOT_LEGS) {
      const item = player.getItemByObjectId(player.legs.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === equipmentSlots.SLOT_GLOVES) {
      const item = player.getItemByObjectId(player.gloves.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item);
    }

    if (slot === equipmentSlots.SLOT_FEET) {
      const item = player.getItemByObjectId(player.feet.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item);
    }

    if (slot === equipmentSlots.SLOT_HEAD) {
      const item = player.getItemByObjectId(player.head.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item);
    }

    if (slot === equipmentSlots.SLOT_LR_HAND) {
      const item = player.getItemByObjectId(player.hand.leftAndRight.objectId);
      if (!item) return;

      item.unEquip();
      player.unEquipItem(item);
    }

    client.sendPacket(new serverPackets.UserInfo(player));
    client.sendPacket(new serverPackets.ItemList(player.getItems()));
  }
}

module.exports = RequestUnEquipItem;