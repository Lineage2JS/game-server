const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');

class Logout {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const character = await database.getCharacter(player.objectId);

    if (character) { // сохранять точно не тут. В каком-нибудь менеджере.
      character.x = Math.floor(player.x); // fix, update all doc?
      character.y = Math.floor(player.y);
      character.z = Math.floor(player.z);

      await database.updateCharacter(character.objectId, character);
    }

    this._client.sendPacket(new serverPackets.LeaveWorld());
  }
}

module.exports = Logout;