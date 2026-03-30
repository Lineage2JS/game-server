const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const characterTemplates = require('./../../datapack/characterTemplates.json');

class NewCharacter extends ClientPacketNew {
  handle() {
    const client = this.getClient();

    client.sendPacket(new serverPackets.CharacterTemplates(characterTemplates));
  }
}

module.exports = NewCharacter;