const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestDestroyItem extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const count = this.readD();
    const item = player.getItemByObjectId(objectId);

    player.deleteItemByObjectId(item.getObjectId(), count);

    const items = player.getItems();

    client.sendPacket(new serverPackets.ItemList(items));
  }
}

module.exports = RequestDestroyItem;