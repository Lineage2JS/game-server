const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');
const itemManager = require('./../Managers/ItemsManager');

class RequestGameStart extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const characterSlot = this.readD();
    const characters = await database.getCharactersByLogin(player.login);
    const character = characters[characterSlot];

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
    
    client.sendPacket(new serverPackets.CharacterSelected(character));
  }
}

module.exports = RequestGameStart;