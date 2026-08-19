const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');

class RequestCharacterDelete extends ClientPacketNew {
  static code = 0x0C;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const characterSlot = this.readD();

    if (!player || !player.login) return;

    const characters = await database.getCharactersByLogin(player.login);
    const character = characters[characterSlot];

    if (!character || !character.objectId) return;

    await playersManager.deleteCharacter(player.login, character.objectId);

    client.sendPacket(new serverPackets.CharacterDeleteOk());
    client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, await database.getCharactersByLogin(player.login)));
  }
}

module.exports = RequestCharacterDelete;