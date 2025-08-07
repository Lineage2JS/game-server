const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');
const Item = require('./../Models/Item');

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
    const inventoryItems = await database.getCharacterInventoryItems(character.objectId);

    player.update(character);

    // fix
    for (let i = 0; i < inventoryItems.length; i++) {
      const inventoryItem = inventoryItems[i];
      const item = new Item( // fix
        inventoryItem.objectId,
        inventoryItem.itemId,
        inventoryItem.consumeType,
        inventoryItem.itemType,
        inventoryItem.itemName,
        inventoryItem.equipSlot,
      );

      player.addItem(item);
    }
    //
    
    this._client.sendPacket(new serverPackets.CharacterSelected(character));
  }
}

module.exports = CharacterSelected;