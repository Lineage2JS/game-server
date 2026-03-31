const ClientPacketNew = require("./ClientPacketNew");

class RequestDropItem extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const count = this.readD();
    const x = this.readD();
    const y = this.readD();
    const z = this.readD();

    player.emit('dropItem', objectId, x, y, z);
  }
}

module.exports = RequestDropItem;