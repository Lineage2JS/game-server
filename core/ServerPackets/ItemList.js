const ServerPacket = require('./ServerPacket.js');
const equipmentSlotEnums = require('./../../enums/equipmentSlotEnums');

//
const slot = {
		"chest": equipmentSlotEnums.SLOT_CHEST,
		"chest_full": equipmentSlotEnums.SLOT_FULL_ARMOR,
		"head": equipmentSlotEnums.SLOT_HEAD,
		"underwear": equipmentSlotEnums.SLOT_UNDERWEAR,
		"back": equipmentSlotEnums.SLOT_BACK,
		"neck": equipmentSlotEnums.SLOT_NECK,
		"legs": equipmentSlotEnums.SLOT_LEGS,
		"feet": equipmentSlotEnums.SLOT_FEET,
		"gloves": equipmentSlotEnums.SLOT_GLOVES,
		"chest,legs": equipmentSlotEnums.SLOT_CHEST, // | L2Item.SLOT_LEGS,
		"rhand": equipmentSlotEnums.SLOT_R_HAND,
		"lhand": equipmentSlotEnums.SLOT_L_HAND,
		"lrhand": equipmentSlotEnums.SLOT_LR_HAND,
		"rear,lear": equipmentSlotEnums.SLOT_L_EAR, // | L2Item.SLOT_R_EAR,
		"rfinger,lfinger": equipmentSlotEnums.SLOT_L_FINGER, // | L2Item.SLOT_R_FINGER,
		"none": equipmentSlotEnums.SLOT_NONE
	}
//

class ItemList {
  /**
   * @param {import('../Models/Item.js')[]} items
   * @param {boolean} showWindow
   */
  constructor(items, showWindow = false) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x27)
      .writeH(showWindow ? 0x01 : 0x00)
      .writeH(items.length)

    for(let i = 0; i < items.length; i++) {
      const item = items[i];

      this._packet
        .writeH(item.getType1())
        .writeD(item.getObjectId())
        .writeD(item.getItemId())
        .writeD(item.getCount())
        .writeH(item.getType2());

      this._packet.writeH(0xff); // TODO

      if (item.isEquipped) { // TODO
        this._packet.writeH(0x01);
      } else {
        this._packet.writeH(0x00);
      }

      this._packet
        .writeD(item.getBodyPart())
        .writeH(0x00) // getEnchantLevel
        .writeH(0x00); // TODO
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ItemList;