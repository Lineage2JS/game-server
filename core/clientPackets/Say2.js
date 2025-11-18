const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

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

class Say2 {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS()
      .readD();

    this._init();
  }

  get text() {
    return this._data.getData()[0];
  }
	
  get type() {
    return this._data.getData()[1];
  }
  
  get target() {
    return this._data.getData()[2];
  }

  async _init() {
    if (this.type == ALL || this.type == SHOUT || this.type == TRADE) { // TODO for beta release
      const player = playersManager.getPlayerByClient(this._client);

      this._client.sendPacket(new serverPackets.CreateSay(player.objectId, player.characterName, this.type, this.text)); 
    } else {
      this._client.sendPacket(new serverPackets.ActionFailed());

      return;
    }
  }
}

module.exports = Say2;