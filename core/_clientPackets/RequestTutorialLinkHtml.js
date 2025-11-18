const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestTutorialLinkHtml {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS();

    this._init();
  }

  get bypass() {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.bypass === 'tutorial_close_0') {
      this._client.sendPacket(new serverPackets.TutorialCloseHtml());
    }
  }
}

module.exports = RequestTutorialLinkHtml;