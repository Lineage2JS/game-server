const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');
const itemManager = require('./../Managers/ItemsManager');

class CharacterSelected {
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

    player.updateParams(character);

    const inventoryItems = await database.getCharacterInventoryItems(character.objectId);
    // fix
    for (let i = 0; i < inventoryItems.length; i++) {
      const inventoryItem = inventoryItems[i];
      const item = itemManager.getItem(inventoryItem.itemId, inventoryItem.objectId)

      // const item = new Item( // fix
      //   inventoryItem.itemCount,
      //   inventoryItem.equipSlot,
      // );

      player.addItem(item);
    }

    const skills = await database.getCharacterSkills(character.objectId);

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      player.addSkill(skill);
    }
    
    this._client.sendPacket(new serverPackets.CharacterSelected(character));
  }
}

module.exports = CharacterSelected;