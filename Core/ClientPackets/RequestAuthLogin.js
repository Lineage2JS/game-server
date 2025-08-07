const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const database = require('./../../database');
const playersManager = require('./../Managers/PlayersManager');
const config = require('./../../config');

class RequestAuthLogin {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS()
      .readD()
      .readD()
      .readD()
      .readD();

    this._init();
  }

  get login() {
    return this._data.getData()[0];
  }

  get sessionKey1() {
    const sessionKey1 = [];

    sessionKey1[0] = this._data.getData()[3].toString(16);
    sessionKey1[1] = this._data.getData()[4].toString(16);

    return sessionKey1;
  }

  get sessionKey2() {
    const sessionKey2 = [];

    sessionKey2[0] = this._data.getData()[2].toString(16);
    sessionKey2[1] = this._data.getData()[1].toString(16);

    return sessionKey2;
  }

  async _init() {
    if (this._client.getProtocolVersion() !== config.main.CLIENT_PROTOCOL_VERSION) {
      return;
    }

    const player = playersManager.getPlayerByClient(this._client);
    const characters = await database.getCharactersByLogin(this.login); // fix

    player.update({
      login: this.login
    }); // fix?

    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = RequestAuthLogin;