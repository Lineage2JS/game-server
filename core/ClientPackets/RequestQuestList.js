const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestQuestList {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);

    this._init();
  }

  _init() {
    const player = playersManager.getPlayerByClient(this._client);
    
    //this._client.sendPacket(new serverPackets.QuestList(player.getQuests()));

    // fix
    this._client.sendPacket(new serverPackets.QuestList(player.getQuests().filter(quest => quest.isCompleted === false)));
  }
}

module.exports = RequestQuestList;