const ClientPacketNew = require("./ClientPacketNew");
const serverPackets = require('./../ServerPackets/serverPackets');

class RequestShortCutReg extends ClientPacketNew {
  static code = 0x33;

  handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const type = this.readD();
    const slot = this.readD();
    const id = this.readD();
    const unk = this.readD(); // TODO characterType?

    client.sendPacket(new serverPackets.ShortCutRegister(slot, type, id, -1, unk))
  }
}

module.exports = RequestShortCutReg;