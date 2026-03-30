const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestItemList extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const items = player.getItems();

    client.sendPacket(new serverPackets.ItemList(items, true));
  }
}

module.exports = RequestItemList;