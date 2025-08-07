const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');
const database = require('./../../database');

class EnterWorld {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.SunRise()); // TimeManager?
    this._client.sendPacket(new serverPackets.SystemMessage(34)); // fix

    // fix?
    playersManager.emit('spawn', player);
    //

    //
    //this._client.sendPacket(new serverPackets.CreateSay({ objectId: 0, characterName: '' }, 10, 'Welcome to Lineage 2 JS'));
    //
    // this._client.sendPacket(new serverPackets.VehicleInfo({
    //   objectId: await database.getNextObjectId(),
    //   x: -96622,
    //   y: 261660,
    //   z: -3610,
    //   heading: 32768
    // }));
    //
  }
}

module.exports = EnterWorld;