const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../Database');
const playersManager = require('./../Managers/PlayersManager');
const characterDeletionManager = require('./../Managers/CharacterDeletionManager');

class CharacterDelete {
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

    characterDeletionManager.on('completed', async(taskId) => {
      console.log('task completed', taskId);

      await database.deleteCharacter(character.objectId);
      await database.deleteCharacterInventory(character.objectId);
    
      this._client.sendPacket(new serverPackets.CharacterDeleteOk());
      this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, await database.getCharactersByLogin(player.login))); // fix?
    })

    characterDeletionManager.addTask();
  }
}

module.exports = CharacterDelete;