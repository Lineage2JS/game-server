const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const config = require('./../../config');

class SendProtocolVersion extends ClientPacketNew {
  static code = 0x00;

  handle() {
    const client = this.getClient();
    const version = this.readD();
    const isValidProtocolVersion = version === config.main.CLIENT_PROTOCOL_VERSION;

    client.setProtocolVersion(version);
    client.sendPacket(new serverPackets.VersionCheck(isValidProtocolVersion, config.main.encryptionKeys.XOR), false);
  }
}

module.exports = SendProtocolVersion;