const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const tutorialHtmlMessagesManager = require('./../Managers/TutorialHtmlMessagesManager');

class RequestTutorialQuestionMarkPressed {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get number() {
    return this._data.getData()[0];
  }

  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.number === 12) {
      this._client.sendPacket(new serverPackets.TutorialShowHtml(tutorialHtmlMessagesManager.getHtmlMessageByFileName('tutorial_012')));
    }
  }
}

module.exports = RequestTutorialQuestionMarkPressed;