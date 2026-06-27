const ClientPacketNew = require("./ClientPacketNew");

class CanNotMoveAnymore extends ClientPacketNew {
  static code = 0x36;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const x = this.readD();
    const y = this.readD();
    const z = this.readD();
    const heading = this.readD();
    //this._client.sendPacket(new serverPackets.StopMoveWithLocation());
  }
}

module.exports = CanNotMoveAnymore;