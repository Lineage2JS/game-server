const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestDestroyItem extends ClientPacketNew {
  static code = 0x59;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const count = this.readD();

    if (!player) return;

    const item = player.getItemByObjectId(objectId);

    if (!item) return;

    player.deleteItemByObjectId(item.getObjectId(), count);

    const items = player.getItems();

    client.sendPacket(new serverPackets.ItemList(items));
  }
}

module.exports = RequestDestroyItem;