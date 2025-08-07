const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");

class RequestAcquireSkill {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD();

    this._init();
  }

   get skillId() {
    return this._data.getData()[0];
  }

  get skillLevel() {
    return this._data.getData()[1];
  }

  async _init() {
    this._client.sendPacket(new serverPackets.AcquireSkillDone());
  }
}

module.exports = RequestAcquireSkill;