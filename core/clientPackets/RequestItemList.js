const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestItemList extends ClientPacketNew {
  static code = 0x0F;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();

    if (!player) return;

    const items = player.getItems();

    client.sendPacket(new serverPackets.ItemList(items, true));
  }
}

module.exports = RequestItemList;