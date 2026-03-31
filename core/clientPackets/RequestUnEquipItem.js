const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestUnEquipItem extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const slot = this.readD();

    // TODO Переработать систему с слотами и убрать magic numbers
    if (slot === 0x0080) { // SLOT_R_HAND
      const item = player.getItemByObjectId(player.hand.right.objectId);
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === 0x0100) {
      const item = player.getItemByObjectId(player.hand.left.objectId);
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === 0x0400) { // SLOT_CHEST
      const item = player.getItemByObjectId(player.chest.objectId);
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === 0x0800) { // SLOT_LEGS
      const item = player.getItemByObjectId(player.legs.objectId);
      
      item.unEquip();
      player.unEquipItem(item); // unEquipItemBySlot()
    }

    if (slot === 0x0200) { // SLOT_GLOVES
      const item = player.getItemByObjectId(player.gloves.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    if (slot === 0x1000) { // SLOT_FEET
      const item = player.getItemByObjectId(player.feet.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    if (slot === 0x0040) { // SLOT_HEAD
      const item = player.getItemByObjectId(player.head.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    if (slot === 0x4000) { // SLOT_LR_HAND
      const item = player.getItemByObjectId(player.hand.leftAndRight.objectId);

      item.unEquip();
      player.unEquipItem(item);
    }

    client.sendPacket(new serverPackets.UserInfo(player));
    client.sendPacket(new serverPackets.ItemList(player.getItems()));
  }
}

module.exports = RequestUnEquipItem;