const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');
const config = require('./../../config');

class RequestAuthLogin extends ClientPacketNew {
  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const accountName = this.readS();
    const sessionKey1 = [
      this.readD().toString(16),
      this.readD().toString(16)
    ];
    const sessionKey2 = [
      this.readD().toString(16),
      this.readD().toString(16)
    ];

    if (client.getProtocolVersion() !== config.main.CLIENT_PROTOCOL_VERSION) {
      return;
    }

    const characters = await database.getCharactersByLogin(accountName); // TODO в логин я могу передать все что угодно, by player?

    player.login = accountName // TODO to delete
    player.setAccountName(accountName);
    client.sendPacket(new serverPackets.CharacterSelectInfo(player.getAccountName(), characters));
  }
}

module.exports = RequestAuthLogin;