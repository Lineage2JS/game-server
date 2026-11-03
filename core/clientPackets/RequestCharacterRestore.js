const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');

class RequestCharacterRestore extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const characterSlot = this.readD();
    const characters = await database.getCharactersByLogin(player.getAccountName());
    const character = characters[characterSlot];

    await playersManager.restoreCharacter(character.objectId);

    client.sendPacket(new serverPackets.CharacterSelectInfo(player.getAccountName(), await database.getCharactersByLogin(player.getAccountName())));
  }
}

module.exports = RequestCharacterRestore;