const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const ItemWeapon = require('./../Models/ItemWeapon');

class RequestUseItem extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const item = player.getItemByObjectId(objectId);

    // if (item.itemName === 'soulshot_none') {
    //   player.deleteItemByName(item.itemName);
    //   player.target = player.objectId; // fix? вернуть обратно
    //   player.setActiveSoulShot();
    //   client.sendPacket(new serverPackets.MagicSkillUse(player, {
    //     id: 2039,
    //     level: 1,
    //     hitTime: 0,
    //     reuseDelay: 0,
    //   }));
    //   player.target = null;

    //   return;
    // }
    
    // if (item.itemName === 'world_map') { // TODO ItemHandler Map
    //   client.sendPacket(new serverPackets.ShowMiniMap(item.itemId));

    //   return;
    // }

    if (!item.isEquipable) {
      return;
    }
    
    if (item.isEquipped) { // TODO не надевать адену и стрелы
      player.unEquipItem(item);
    } else {
      player.equipItem(item);
    }

    client.sendPacket(new serverPackets.UserInfo(player));
    client.sendPacket(new serverPackets.ItemList(player.getItems()));
  }
}

module.exports = RequestUseItem;