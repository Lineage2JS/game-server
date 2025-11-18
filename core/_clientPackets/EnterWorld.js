const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class EnterWorld {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    player.mSpd = 333; // TODO?
    
    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.SunRise()); // TimeManager?
    this._client.sendPacket(new serverPackets.SystemMessage(34)); // fix

    // fix?
    playersManager.emit('spawn', player);
    //
  }
}

module.exports = EnterWorld;