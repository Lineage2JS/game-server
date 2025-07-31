const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const Character = require('./../Models/Character');
const database = require('./../../Database');
const characterTemplates = require('./../data/characterTemplates.json');
const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/ItemsManager');

class RequestCharacterCreate {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get name() {
    return this._data.getData()[0];
  }

  get race() {
    return this._data.getData()[1];
  }

  get gender() {
    return this._data.getData()[2];
  }

  get classId() {
    return this._data.getData()[3];
  }

  get hairStyle() {
    return this._data.getData()[10];
  }

  get hairColor() {
    return this._data.getData()[11];
  }

  get face() {
    return this._data.getData()[12];
  }

  _checkCharacterNameLetters(name) {
    const regexp = /^[0-9A-Za-z]*$/gi;

    if (regexp.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  async checkAvailableNumberCharacters(login) {
    const MAXIMUM_NUMBER_OF_CHARACTERS = 7;
    const characters = await database.getCharactersByLogin(login);

    if (characters.length >= MAXIMUM_NUMBER_OF_CHARACTERS) {
      return true;
    } else {
      return false;
    }
  }

  async _init() {
    const MAXIMUM_LENGTH_CHARACTER_NAME = 16;
    const player = playersManager.getPlayerByClient(this._client);
    const isManyCharacters = await this.checkAvailableNumberCharacters(player.login);
    
    // check how many characters are on the account
    if (isManyCharacters) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_TOO_MANY_CHARACTERS))
      
      return;
    }

    // check character name for length and regular expression
    if(this.name <= 0 || this.name.length >= MAXIMUM_LENGTH_CHARACTER_NAME || !this._checkCharacterNameLetters(this.name)) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_16_ENG_CHARS))

      return;
    }

    const isCharacterNameTaken = await database.isCharacterNameTaken(this.name);

    // check character name for availability
    if (isCharacterNameTaken) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_NAME_ALREADY_EXISTS))
      
      return;
    }

    // Get character template by classId (classId is unique)
    const characterTemplate = characterTemplates.find(characterTemplate => {
      if (characterTemplate.classId === this.classId) {
        return true;
      } else {
        return false;
      }
    });

    // create character
    const character = Character.create(characterTemplate);

    character.characterName = this.name;
    character.gender = this.gender;
    character.objectId = await database.getNextObjectId();
    character.login = player.login;
    character.maximumHp = character.hp;
    character.maximumMp = character.mp;
    character.hairStyle = this.hairStyle;
    character.hairColor = this.hairColor;
    character.face = this.face;
    character.createdAt = Date.now();

    // add character to database
    const createdCharacter = await database.createCharacter(character);

    //fix
    //create inventory
    const initialEquipment = require('./../../Data/initialEquipment.json');
    const inventoryItems = [];

    for (let i = 0; i < initialEquipment['human_fighter'].length; i++) {
      const itemName = initialEquipment['human_fighter'][i];
      const item = await itemsManager.createItemByName(itemName);
      const inventoryItem = {
        itemObjectId: item.objectId,
        itemId: item.itemId,
        itemType: item.itemType,
        itemName: item.itemName,
        itemCount: item.getCount(),
        itemEquipSlot: item.equipSlot,
        isEquipped: item.isEquipped,
        consumeType: item.consumeType,
        characterObjectId: createdCharacter.object_id, // extra fix
      }

      inventoryItems.push(inventoryItem);
    }

    await database.createInventory(inventoryItems);
    //

    // get all characters on user account
    const characters = await database.getCharactersByLogin(player.login);
    
    this._client.sendPacket(new serverPackets.CharacterCreateSuccess());
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestCharacterCreate;