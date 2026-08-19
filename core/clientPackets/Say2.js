const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");

const ALL = 0;
const SHOUT = 1;
const TELL = 2;
const PARTY = 3;
const CLAN = 4;
const PRIVATE_CHAT_PLAYER = 6; // used for petition
const PRIVATE_CHAT_GM = 7; // used for petition
const TRADE = 8;
const GM_MESSAGE = 9;
const ANNOUNCEMENT = 10;

class Say2 extends ClientPacketNew {
  static code = 0x38;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const text = this.readS();
    const type = this.readD();
    let target = null;

    if (!player) return;

    if (type == TELL) {
      target = this.readS();
    }

    if (type == ALL || type == SHOUT || type == TRADE) { // TODO for beta release
      client.sendPacket(new serverPackets.CreateSay(player.objectId, player.characterName, type, text)); 
    } else {
      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }
  }
}

module.exports = Say2;