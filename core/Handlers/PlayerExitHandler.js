const playersManager = require('../Managers/PlayersManager');
const serverPackets = require('../ServerPackets/serverPackets');
const database = require('./../../database');

class PlayerExitHandler {
  async handle(player) {
    const client = player.getClient();
    const character = await database.getCharacter(player.objectId);

    if (character) {
      character.x = Math.floor(player.x); // fix, update all doc?
      character.y = Math.floor(player.y);
      character.z = Math.floor(player.z);

      await database.updateCharacter(character.objectId, character);
    }

    client.sendPacket(new serverPackets.LeaveWorld());
    playersManager.removePlayer(player);
  }
}

module.exports = PlayerExitHandler;