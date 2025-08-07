const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');

class RequestCharacterRestore {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get characterSlot () {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const characters = await database.getCharactersByLogin(player.login);
    const character = characters[this.characterSlot];

    await playersManager.restoreCharacter(character.objectId);

    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, await database.getCharactersByLogin(player.login)));
  }
}

module.exports = RequestCharacterRestore;