const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');

class RequestRestart {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const character = await database.getCharacter(player.objectId);

    character.x = Math.floor(player.x); // fix, update all doc?
    character.y = Math.floor(player.y);
    character.z = Math.floor(player.z);

    // clear interval after restart?

    await database.updateCharacter(character.objectId, character);

    const allowRestart = true; // fix
    const characters = await database.getCharactersByLogin(player.login);

    this._client.sendPacket(new serverPackets.RestartResponse(allowRestart));
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestRestart;