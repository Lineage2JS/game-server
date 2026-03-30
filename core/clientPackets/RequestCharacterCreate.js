const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const Character = require('./../Models/Character');
const database = require('./../../database');
const characterTemplates = require('./../../datapack/characterTemplates.json');
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

class RequestCharacterCreate extends ClientPacketNew {
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

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const name = this.readS();
    const race = this.readD();
    const gender = this.readD();
    const classId = this.readD();
    const int = this.readD();
    const str = this.readD();
    const con = this.readD();
    const men = this.readD();
    const dex = this.readD();
    const wit = this.readD();
    const hairStyle = this.readD();
    const hairColor = this.readD();
    const face = this.readD();
    const MAXIMUM_LENGTH_CHARACTER_NAME = 16;
    const isManyCharacters = await this.checkAvailableNumberCharacters(player.login);
    
    // check how many characters are on the account
    if (isManyCharacters) {
      client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_TOO_MANY_CHARACTERS))
      
      return;
    }

    // check character name for length and regular expression
    if(name <= 0 || name.length >= MAXIMUM_LENGTH_CHARACTER_NAME || !this._checkCharacterNameLetters(name)) {
      client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_16_ENG_CHARS))

      return;
    }

    const isCharacterNameTaken = await database.isCharacterNameTaken(name);

    // check character name for availability
    if (isCharacterNameTaken) {
      client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_NAME_ALREADY_EXISTS))
      
      return;
    }

    // Get character template by classId (classId is unique)
    const characterTemplate = characterTemplates.find(characterTemplate => {
      if (characterTemplate.classId === classId) {
        return true;
      } else {
        return false;
      }
    });

    // create character
    const character = Character.create(characterTemplate);

    character.characterName = name;
    character.gender = gender;
    character.objectId = await database.getNextObjectId();
    character.login = player.login;
    character.maximumHp = character.hp;
    character.maximumMp = character.mp;
    character.hairStyle = hairStyle;
    character.hairColor = hairColor;
    character.face = face;
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
    const startPoints = initialParametersManager.getInitialStartPoint(classIds.get(classId));
    const randomPoint = getRandomPointInPolygon(startPoints);

    character.x = randomPoint[0];
    character.y = randomPoint[1];
    character.z = randomPoint[2];

    // add character to database
    const createdCharacter = await database.createCharacter(character);

    //fix humanFighter
    const initialEquipmentIds = initialParametersManager.getInitialEquipmentIds(classIds.get(classId));

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
    
    if (magicClasses.includes(classIds.get(classId))) {
      const skills = [{ id: 1177, level: 1,}, { id: 1216, level: 1,}];

      for(let i = 0; i < skills.length; i++) {
        const skill = skills[i];

        await database.createSkill(skill, createdCharacter.object_id);
      }
    }

    // get all characters on user account
    const characters = await database.getCharactersByLogin(player.login);
    
    client.sendPacket(new serverPackets.CharacterCreateSuccess());
    client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestCharacterCreate;