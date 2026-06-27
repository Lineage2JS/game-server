const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestActionUse extends ClientPacketNew {
  static code = 0x45;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const actionId = this.readD();
    const ctrlStatus = this.readD();
    const shiftStatus = this.readC();

    if (!player) return;

    if (actionId === 0) {
      // invert
      player.waitType = player.waitType ? 0 : 1;

      client.sendPacket(new serverPackets.ChangeWaitType(player, player.waitType));

      return;
    }

    if (actionId === 1) {
      // invert
      player.moveType = player.moveType ? 0 : 1;

      client.sendPacket(new serverPackets.ChangeMoveType(player.objectId, player.moveType));

      return;
    }
  }
}

module.exports = RequestActionUse;