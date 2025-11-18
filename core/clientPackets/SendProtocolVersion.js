const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const config = require('./../../config');

class ProtocolVersion {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD();

    this._init();
  }

  get version() {
    return this._data.getData()[0];
  }

  _init() {
    let isCompliesProtocolVersion = true;

    if (this.version === config.main.CLIENT_PROTOCOL_VERSION) {
      isCompliesProtocolVersion = true;
    } else {
      isCompliesProtocolVersion = false;
    }

    this._client.setProtocolVersion(this.version);
    this._client.sendPacket(new serverPackets.VersionCheck(isCompliesProtocolVersion, config.main.encryptionKeys.XOR), false);
  }
}

module.exports = ProtocolVersion;