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

    player.x = character.x;
    player.y = character.y;
    player.z = character.z;
    player.heading = character.heading;
    player.objectId = character.objectId;
    player.characterName = character.characterName;
    player.raceId = character.raceId
    player.gender = character.gender;
    player.classId = character.classId;
    player.level = character.level;
    player.exp = character.exp;
    player.getStats().setStr(character.str);
    player.dex = character.dex;
    player.con = character.con;
    player.int = character.int;
    player.wit = character.wit;
    player.men = character.men;
    player.maximumHp = character.maximumHp;
    player.hp = character.hp;
    player.maximumMp = character.maximumMp
    player.mp = character.mp;
    player.sp = character.sp;

    player.maleAttackSpeedMultiplier = character.maleAttackSpeedMultiplier;
    player.maleCollisionRadius = character.maleCollisionRadius;
    player.maleCollisionHeight = character.maleCollisionHeight;

    player.baseRunSpeed = character.baseRunSpeed;
    player.baseWalkSpeed = character.baseWalkSpeed;

    player.className = character.className;
    player.karma = character.karma;
    player.pk = character.pk;
    player.pvp = character.pvp;
    player.gm = character.gm;
    player.online = character.online;
    player.accessLevel = character.accessLevel;
    player.title = character.title;
    player.hairStyle = character.hairStyle;
    player.hairColor = character.hairColor;
    player.face = character.face;

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