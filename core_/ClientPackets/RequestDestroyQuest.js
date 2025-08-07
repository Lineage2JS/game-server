const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestDestroyQuest {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get questId() {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    player.deleteQuestById(this.questId);
    this._client.sendPacket(new serverPackets.QuestList(player.getQuests()));
  }
}

module.exports = RequestDestroyQuest;