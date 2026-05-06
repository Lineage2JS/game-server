const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

class RequestActionUse extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const actionId = this.readD();
    const ctrlStatus = this.readD();
    const shiftStatus = this.readC();

    if (actionId === 0) {
      player.waitType = !player.waitType;

      client.sendPacket(new serverPackets.ChangeWaitType(player, player.waitType));

      return;
    }

    if (actionId === 1) {
      player.moveType = !player.moveType;

      client.sendPacket(new serverPackets.ChangeMoveType(player.objectId, player.moveType));

      return;
    }
  }
}

module.exports = RequestActionUse;