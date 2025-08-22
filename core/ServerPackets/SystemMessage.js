const ServerPacket = require('./ServerPacket.js'); 
const SYSTEM_MESSAGE_TYPES = {
	TEXT: 0,
	NUMBER: 1,
	NPC_NAME: 2,
	ITEM_NAME: 3,
	SKILL_NAME: 4
}
const SYSTEM_MESSAGES_ENUMS = {
  WELCOME_TO_LINEAGE_II: 34
}

class SystemMessage {
  constructor(messageId, messages = []) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x7A)
      .writeD(messageId)
      .writeD(messages.length);
    
    // for(let i = 0; i < messages.length; i++) {
    //   const message = messages[i];
  
    //   this._packet.writeD(message.type);
  
    //   switch(message.type) {
    //     case SYSTEM_MESSAGE_TYPES.TEXT:
    //       this._packet.writeS(message.value);
  
    //       break;
    //     case SYSTEM_MESSAGE_TYPES.NUMBER:
    //     case SYSTEM_MESSAGE_TYPES.NPC_NAME:
    //     case SYSTEM_MESSAGE_TYPES.ITEM_NAME:
    //       this._packet.writeD(message.value);
  
    //       break;
    //     case SYSTEM_MESSAGE_TYPES.SKILL_NAME:
    //       this._packet.writeD(message.value)
    //         .writeD(0x01); // skill level
  
    //       break;
    //   }
    // }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SystemMessage;