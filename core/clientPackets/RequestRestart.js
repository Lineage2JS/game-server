const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');

class RequestRestart extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const character = await database.getCharacter(player.objectId);

    character.x = Math.floor(player.x); // fix, update all doc?
    character.y = Math.floor(player.y);
    character.z = Math.floor(player.z);

    // clear interval after restart?

    await database.updateCharacter(character.objectId, character);

    const allowRestart = true; // fix
    const characters = await database.getCharactersByLogin(player.login);

    client.sendPacket(new serverPackets.RestartResponse(allowRestart));
    client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestRestart;