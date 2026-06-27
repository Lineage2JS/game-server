const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const database = require('./../../database');
const config = require('./../../config');

class RequestAuthLogin extends ClientPacketNew {
  static code = 0x08;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const login = this.readS();
    const sessionKey1 = [
      this.readD().toString(16),
      this.readD().toString(16)
    ];
    const sessionKey2 = [
      this.readD().toString(16),
      this.readD().toString(16)
    ];

    if (!player) return;

    if (client.getProtocolVersion() !== config.main.CLIENT_PROTOCOL_VERSION) {
      return;
    }

    const characters = await database.getCharactersByLogin(login); // TODO в логин я могу передать все что угодно, by player?

    player.updateParams({ // TODO тут какая-то неразбериха, логин из пакета берем, зачем-то обновляем.
      login: login
    });

    client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestAuthLogin;