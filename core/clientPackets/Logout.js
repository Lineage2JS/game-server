const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');

class Logout extends ClientPacketNew {
  static code = 0x09;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();

    if (!player) return;

    const character = await database.getCharacter(player.objectId);

    if (character) { // сохранять точно не тут. В каком-нибудь менеджере.
      character.x = Math.floor(player.x); // fix, update all doc?
      character.y = Math.floor(player.y);
      character.z = Math.floor(player.z);

      await database.updateCharacter(character.objectId, character);
    }

    client.sendPacket(new serverPackets.LeaveWorld());
  }
}

module.exports = Logout;