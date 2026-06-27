const database = require('./../../database');
const ItemAsset = require('./../Models/ItemAsset');
const ItemAccessary = require('./../Models/ItemAccessary');
const ItemEtc = require('./../Models/ItemEtc');
const ItemArmor = require('./../Models/ItemArmor');
const ItemWeapon = require('./../Models/ItemWeapon');
const itemsList = require('./../../datapack/itemsList.json');
const itemNamesMap = require('./../../datapack/itemNamesMap.json');
const equipmentSlots = require('../../enums/equipmentSlotEnums');

/** @typedef {ItemAsset | ItemAccessary | ItemEtc | ItemArmor | ItemWeapon} ItemTemplate */
/** @typedef {{ id: number, name: string, item_type: string, etcitem_type?: string | null, consume_type?: string | null, armor_type?: string | null, weapon_type?: string | null, slot_bit_type?: string | null, weight: number, default_price: number }} ItemData */

const TYPE_ARROW = 0;
const TYPE_MATERIAL = 1;
const TYPE_PET_COLLAR = 2;
const TYPE_POTION = 3;
const TYPE_RECEIPE = 4;
const TYPE_SCROLL = 5;
const TYPE_QUEST = 6;
const TYPE_MONEY = 7;
const TYPE_OTHER = 8;
const TYPE_SPELLBOOK = 9;

const TYPE1_WEAPON_RING_EARRING_NECKLACE = 0;
const TYPE1_SHIELD_ARMOR = 1;
const TYPE1_ITEM_QUESTITEM_ADENA = 4;

const TYPE2_WEAPON = 0;
const TYPE2_SHIELD_ARMOR = 1;
const TYPE2_ACCESSORY = 2;
const TYPE2_QUEST = 3;
const TYPE2_MONEY = 4;
const TYPE2_OTHER = 5;

class ItemsManager {
  constructor() {
    /** @type {Map<number, ItemTemplate>} */
    this._itemsTable = new Map();
  }

  /** @returns {void} */
  enable() {
    this._loadItemTemplates();
  }

  /**
   * @param {number} itemId
   * @param {number} [count=1]
   * @returns {Promise<ItemTemplate | undefined>}
   */
  async createItem(itemId, count = 1) {
    const itemTemplate = this._getItemTemplate(itemId);
    if (!itemTemplate) {
      return undefined;
    }
    const objectId = await database.getNextObjectId();

    if (itemTemplate instanceof ItemAsset) {
      return this._createItemAsset(itemTemplate, objectId, count);
    }

    if (itemTemplate instanceof ItemAccessary) {
      return this._createItemAccessary(itemTemplate, objectId);
    }

    if (itemTemplate instanceof ItemEtc) {
      return this._createItemEtc(itemTemplate, objectId);
    }

    if (itemTemplate instanceof ItemArmor) {
      return this._createItemArmor(itemTemplate, objectId);
    }

    if (itemTemplate instanceof ItemWeapon) {
      return this._createItemWeapon(itemTemplate, objectId);
    }

    return undefined;
  }

  /**
   * @param {number} itemId
   * @param {number} objectId
   * @param {number} [count=1]
   * @returns {ItemTemplate | undefined}
   */
  getItem(itemId, objectId, count = 1) {
    const itemTemplate = this._getItemTemplate(itemId);
    if (!itemTemplate) {
      return undefined;
    }

    if (itemTemplate instanceof ItemAsset) {
      return this._createItemAsset(itemTemplate, objectId, count);
    }

    if (itemTemplate instanceof ItemAccessary) {
      return this._createItemAccessary(itemTemplate, objectId);
    }

    if (itemTemplate instanceof ItemEtc) {
      return this._createItemEtc(itemTemplate, objectId);
    }

    if (itemTemplate instanceof ItemArmor) {
      return this._createItemArmor(itemTemplate, objectId);
    }

    if (itemTemplate instanceof ItemWeapon) {
      return this._createItemWeapon(itemTemplate, objectId);
    }

    return undefined;
  }

  /**
   * @param {string} itemName
   * @returns {number}
   */
  getItemIdByName(itemName) {
    return itemNamesMap[/** @type {keyof typeof itemNamesMap} */ (itemName)];
  }

  /**
   * @param {ItemAsset} itemTemplate
   * @param {number} objectId
   * @param {number} count
   * @returns {ItemAsset}
   */
  _createItemAsset(itemTemplate, objectId, count) {
    const data = {
      itemId: itemTemplate.getItemId(),
      name: itemTemplate.getName(),
      etcItemType: itemTemplate.getEtcItemType(),
      type1: itemTemplate.getType1(),
      type2: itemTemplate.getType2(),
      bodyPart: itemTemplate.getBodyPart(),
      weight: itemTemplate.getWeight(),
      price: itemTemplate.getPrice(),
      stackable: itemTemplate.getStackable(),
    }
    const itemAsset = new ItemAsset(data);

    itemAsset.setObjectId(objectId);
    itemAsset.setCount(count);

    return itemAsset;
  }

  /**
   * @param {ItemAccessary} itemTemplate
   * @param {number} objectId
   * @returns {ItemAccessary}
   */
  _createItemAccessary(itemTemplate, objectId) {
    const data = {
      itemId: itemTemplate.getItemId(),
      name: itemTemplate.getName(),
      type1: itemTemplate.getType1(),
      type2: itemTemplate.getType2(),
      bodyPart: itemTemplate.getBodyPart(),
      weight: itemTemplate.getWeight(),
      price: itemTemplate.getPrice(),
    }
    const itemAccessary = new ItemAccessary(data);

    itemAccessary.setObjectId(objectId);

    return itemAccessary;
  }

  /**
   * @param {ItemEtc} itemTemplate
   * @param {number} objectId
   * @returns {ItemEtc}
   */
  _createItemEtc(itemTemplate, objectId) {
    const data = {
      itemId: itemTemplate.getItemId(),
      name: itemTemplate.getName(),
      etcItemType: itemTemplate.getEtcItemType(),
      type1: itemTemplate.getType1(),
      type2: itemTemplate.getType2(),
      bodyPart: itemTemplate.getBodyPart(),
      weight: itemTemplate.getWeight(),
      price: itemTemplate.getPrice(),
      stackable: itemTemplate.getStackable(),
    }
    const itemEtc = new ItemEtc(data);

    itemEtc.setObjectId(objectId);

    return itemEtc;
  }

  /**
   * @param {ItemArmor} itemTemplate
   * @param {number} objectId
   * @returns {ItemArmor}
   */
  _createItemArmor(itemTemplate, objectId) {
    const data = {
      itemId: itemTemplate.getItemId(),
      name: itemTemplate.getName(),
      armorType: itemTemplate.getArmorType(),
      type1: itemTemplate.getType1(),
      type2: itemTemplate.getType2(),
      bodyPart: itemTemplate.getBodyPart(),
      weight: itemTemplate.getWeight(),
      price: itemTemplate.getPrice(),
    }
    const itemArmor = new ItemArmor(data);

    itemArmor.setObjectId(objectId);

    return itemArmor;
  }

  /**
   * @param {ItemWeapon} itemTemplate
   * @param {number} objectId
   * @returns {ItemWeapon}
   */
  _createItemWeapon(itemTemplate, objectId) {
    const data = {
      itemId: itemTemplate.getItemId(),
      name: itemTemplate.getName(),
      weaponType: itemTemplate.getWeaponType(),
      type1: itemTemplate.getType1(),
      type2: itemTemplate.getType2(),
      bodyPart: itemTemplate.getBodyPart(),
      weight: itemTemplate.getWeight(),
      price: itemTemplate.getPrice(),
    }
    const itemWeapon = new ItemWeapon(data);

    itemWeapon.setObjectId(objectId);

    return itemWeapon;
  }

  /** @returns {void} */
  _loadItemTemplates() {
    for(const itemData of /** @type {ItemData[]} */ (itemsList)) {
      //questitem

      if (itemData.item_type === "asset") {
        this._createItemAssetTemplate(itemData);
      }

      if (itemData.item_type === "accessary") {
        this._createItemAccessaryTemplate(itemData);
      }

      if (itemData.item_type === "etcitem") {
        this._createItemEtcTemplate(itemData);
      }

      if (itemData.item_type === "armor") {
        this._createItemArmorTemplate(itemData);
      }

      if (itemData.item_type === "weapon") {
        this._createItemWeaponTemplate(itemData);
      }
    }
  }

  /**
   * @param {ItemData} itemData
   * @returns {void}
   */
  _createItemAssetTemplate(itemData) {
    const data = {
      itemId: itemData.id,
      name: itemData.name,
      etcItemType: TYPE_MONEY,
      type1: TYPE1_ITEM_QUESTITEM_ADENA,
      type2: TYPE2_MONEY,
      bodyPart: equipmentSlots.SLOT_NONE,
      weight: itemData.weight,
      price: itemData.default_price,
      stackable: true,
    }
    const itemAsset = new ItemAsset(data);

    this._addItem(itemAsset.getItemId(), itemAsset);
  }

  /**
   * @param {ItemData} itemData
   * @returns {void}
   */
  _createItemAccessaryTemplate(itemData) {
    const data = {
      itemId: itemData.id,
      name: itemData.name,
      type1: TYPE1_WEAPON_RING_EARRING_NECKLACE,
      type2: TYPE2_ACCESSORY,
      bodyPart: equipmentSlots.SLOT_NECK, // TODO NECK, EAR, FINGER
      weight: itemData.weight,
      price: itemData.default_price,
    }
    const itemAccessary = new ItemAccessary(data);

    this._addItem(itemAccessary.getItemId(), itemAccessary);
  }

  /**
   * @param {ItemData} itemData
   * @returns {void}
   */
  _createItemEtcTemplate(itemData) {
    let type2 = TYPE2_OTHER;
    let etcItemType = TYPE_OTHER
    let bodyPart = equipmentSlots.SLOT_NONE;
    let stackable = false;

    switch(itemData.etcitem_type) {
      case 'none':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_OTHER;

        break;
      case 'arrow':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_ARROW;
        bodyPart = equipmentSlots.SLOT_L_HAND;

        break;
      case 'castle_guard':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_SCROLL;

        break;
      case 'material':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_MATERIAL;

        break;
      case 'pet_collar':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_PET_COLLAR;

        break;
      case 'potion':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_POTION;

        break;
      case 'recipe':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_RECEIPE;

        break;
      case 'scroll':
        type2 = TYPE2_OTHER;
        etcItemType = TYPE_SCROLL;

        break;
    }

    if (itemData.consume_type === 'consume_type_stackable') {
      stackable = true;
    } else {
      stackable = false;
    }

    const data = {
      itemId: itemData.id,
      name: itemData.name,
      etcItemType,
      type1: TYPE1_ITEM_QUESTITEM_ADENA,
      type2,
      bodyPart,
      weight: itemData.weight,
      price: itemData.default_price,
      stackable,
    }
    const itemEtc = new ItemEtc(data);

    this._addItem(itemEtc.getItemId(), itemEtc);
  }

  /**
   * @param {ItemData} itemData
   * @returns {void}
   */
  _createItemArmorTemplate(itemData) {
    const slot = equipmentSlots.getSlotIdByName(itemData.slot_bit_type);

    if (!slot) return;

    const data = {
      itemId: itemData.id,
      name: itemData.name,
      armorType: itemData.armor_type ? itemData.armor_type : "none",
      type1: TYPE1_SHIELD_ARMOR,
      type2: TYPE2_SHIELD_ARMOR,
      bodyPart: slot,
      weight: itemData.weight,
      price: itemData.default_price,
    }
    const itemArmor = new ItemArmor(data);

    this._addItem(itemArmor.getItemId(), itemArmor);
  }

  /**
   * @param {ItemData} itemData
   * @returns {void}
   */
  _createItemWeaponTemplate(itemData) {
    const slot = equipmentSlots.getSlotIdByName(itemData.slot_bit_type);

    if (!slot) return;

    const data = {
      itemId: itemData.id,
      name: itemData.name,
      weaponType: itemData.weapon_type ? itemData.weapon_type : "none",
      type1: TYPE1_WEAPON_RING_EARRING_NECKLACE,
      type2: TYPE2_WEAPON,
      bodyPart: slot,
      weight: itemData.weight,
      price: itemData.default_price,
    };
    const itemWeapon = new ItemWeapon(data);

    this._addItem(itemWeapon.getItemId(), itemWeapon);
  }

  /**
   * @param {number} itemId
   * @param {ItemTemplate} item
   * @returns {void}
   */
  _addItem(itemId, item) {
    this._itemsTable.set(itemId, item);
  }

  /**
   * @param {number} itemId
   * @returns {ItemTemplate | undefined}
   */
  _getItemTemplate(itemId) {
    return this._itemsTable.get(itemId);
  }
  // TODO loadItem from RequestGameStart
}

module.exports = new ItemsManager();