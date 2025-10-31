const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const Character = require('./../Models/Character');
const database = require('./../../database');
const characterTemplates = require('./../../datapack/characterTemplates.json');
const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/ItemsManager');
const initialParametersManager = require('./../Managers/InitialParametersManager');

function getRandomPointInPolygon(points) {
    // Находим ограничивающий прямоугольник (bounding box)
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (const point of points) {
        minX = Math.min(minX, point[0]);
        maxX = Math.max(maxX, point[0]);
        minY = Math.min(minY, point[1]);
        maxY = Math.max(maxY, point[1]);
    }
    
    // Округляем границы в большую сторону
    minX = Math.floor(minX);
    maxX = Math.ceil(maxX);
    minY = Math.floor(minY);
    maxY = Math.ceil(maxY);
    
    // Генерируем случайные точки пока не найдем внутри полигона
    let randomPoint, isInside;
    do {
        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        // Округляем координаты в большую сторону
        randomPoint = [Math.ceil(x), Math.ceil(y), points[0][2]]; // Сохраняем Z-координату
        
        isInside = isPointInPolygon(randomPoint, points);
    } while (!isInside);
    
    return randomPoint;
}

// Функция проверки нахождения точки внутри полигона (алгоритм ray casting)
function isPointInPolygon(point, polygon) {
    const x = point[0], y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
    }
    
    return inside;
}

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
    const regexp = /^[0-9A-Za-z]*$/i;

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

    // TODO
    const classIds = new Map();

    classIds.set(0, 'humanFighter');
    classIds.set(10, 'humanMagician');

    classIds.set(18, 'elfFighter');
    classIds.set(25, 'elfMagician');
    classIds.set(31, 'darkelfFighter');
    classIds.set(38, 'darkelfMagician');
    classIds.set(44, 'orcFighter');
    classIds.set(49, 'orcShaman');
    classIds.set(53, 'dwarfApprentice');
    //

    // TODO set start points
    const startPoints = initialParametersManager.getInitialStartPoint(classIds.get(this.classId));
    const randomPoint = getRandomPointInPolygon(startPoints);

    character.x = randomPoint[0];
    character.y = randomPoint[1];
    character.z = randomPoint[2];

    // add character to database
    const createdCharacter = await database.createCharacter(character);

    //fix humanFighter
    const initialEquipmentIds = initialParametersManager.getInitialEquipmentIds(classIds.get(this.classId));

    for (let i = 0; i < initialEquipmentIds.length; i++) {
      const itemId = initialEquipmentIds[i];
      const item = await itemsManager.createItem(itemId);
      const dbItem = { // TODO dbItem?
        objectId: item.getObjectId(),
        itemId: item.getItemId(),
        itemCount: item.getCount(),
        location: 'inventory',
        ownerObjectId: createdCharacter.object_id, // extra fix
        equipSlot: 0,
      }

      await database.createItem(dbItem);
    }

    // create base skill for beta release // TODO
    const magicClasses = ['humanMagician', 'elfMagician', 'darkelfMagician'];
    
    if (magicClasses.includes(classIds.get(this.classId))) {
      const skills = [{ id: 1177, level: 1,}, { id: 1216, level: 1,}];

      for(let i = 0; i < skills.length; i++) {
        const skill = skills[i];

        await database.createSkill(skill, createdCharacter.object_id);
      }
    }

    // get all characters on user account
    const characters = await database.getCharactersByLogin(player.login);
    
    this._client.sendPacket(new serverPackets.CharacterCreateSuccess());
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestCharacterCreate;