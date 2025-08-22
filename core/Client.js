// const XOR = require('./libs/XOR.js');
// const xor = new XOR([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const clientPackets = require('./ClientPackets/clientPackets');

class Client {
  constructor(socket) {
    this._socket = socket;
    this._protocolVersion = null;
    
    this._init();
  }

  sendPacket(packetInstance, encoding = true) {
    const buffer = packetInstance.getBuffer();
    const packetLength = this._getPacketLength(buffer);
    let payload = buffer;

    // if (encoding) {
    //   payload = Buffer.from(blowfish.encrypt(buffer));
    // }

    const packet = Buffer.concat([packetLength, payload]);

    this._socket.write(packet);
  }

  setProtocolVersion(value) {
    this._protocolVersion = value;
  }
  
  getProtocolVersion() {
    return this._protocolVersion;
  }

  _getPacketLength(buffer) {
    const length = Buffer.from([0x00, 0x00]);
    
    length.writeInt16LE(buffer.length + 2);

    return length;
  }

  _getCroppedPacket(data) {
    const buffer = Buffer.from(data, 'binary');
    const croppedPacket = buffer.subarray(2);
    
    return croppedPacket;
  }

  _getDecryptedPacket(packet) {
    const decryptedPacket = packet; //blowfish.decrypt(packet);
    const buffer = Buffer.from(decryptedPacket);

    return buffer;
  }

  _getOpcode(packet) {
    return packet[0];
  }

  _getPayloadPacket(packet) {
    return packet.subarray(1);
  }

  _onData(data) {
    const croppedPacket = this._getCroppedPacket(data);
    const decryptedPacket = this._getDecryptedPacket(croppedPacket);
    const opcode = this._getOpcode(decryptedPacket);
    const payloadPacket = this._getPayloadPacket(decryptedPacket);

    console.log(`opcode: [0x${opcode.toString(16).toUpperCase().padStart(2, '0')}]`);

    switch(opcode) {
      case 0x00:
        new clientPackets.SendProtocolVersion(this, payloadPacket);

        break;
      case 0x04:
        new clientPackets.Action(this, payloadPacket);

        break;
      case 0x08:
        new clientPackets.RequestAuthLogin(this, payloadPacket);

        break;
      case 0x0D:
        new clientPackets.CharacterSelected(this, payloadPacket);

        break;
      case 0x63:
        new clientPackets.RequestQuestList(this, payloadPacket);

        break;
      case 0x03:
        new clientPackets.EnterWorld(this, payloadPacket);
  
        break;
      case 0x0E:
        new clientPackets.NewCharacter(this, payloadPacket);

        break;
      case 0x0B:
        new clientPackets.RequestCharacterCreate(this, payloadPacket);

        break;
      case 0x0C:
        new clientPackets.RequestCharacterDelete(this, payloadPacket);

        break;
      case 0x01:
        new clientPackets.MoveBackwardToLocation(this, payloadPacket);
  
        break;
      case 0x0A:
        new clientPackets.RequestAttack(this, payloadPacket);

        break;
      case 0x09:
        new clientPackets.Logout(this, payloadPacket);
  
        break;
      case 0x46:
        new clientPackets.RequestRestart(this, payloadPacket);

        break;
      case 0x37:
        new clientPackets.RequestTargetCancel(this, payloadPacket);

        break;
      case 0x0F:
        new clientPackets.RequestItemList(this, payloadPacket);

        break;
      case 0x33:
        new clientPackets.RequestShortCutReg(this, payloadPacket);

        break;
      case 0x21:
        new clientPackets.RequestBypassToServer(this, payloadPacket);

        break;
      case 0x3F:
        new clientPackets.RequestSkillList(this, payloadPacket);

        break;
      case 0x2F:
        new clientPackets.RequestMagicSkillUse(this, payloadPacket);

        break;
      case 0x57:
        new clientPackets.RequestShowBoard(this, payloadPacket);

        break;
      case 0x1B:
        new clientPackets.RequestSocialAction(this, payloadPacket);

        break;
      case 0x48:
        new clientPackets.ValidatePosition(this, payloadPacket);

        break;
      case 0x45:
        new clientPackets.RequestActionUse(this, payloadPacket);

        break;
      case 0x38:
        new clientPackets.Say2(this, payloadPacket);

        break;
      case 0x5B:
        new clientPackets.SendBypassBuildCmd(this, payloadPacket);

        break;
      case 0x20:
        new clientPackets.RequestLinkHtml(this, payloadPacket);
  
        break;
      case 0x14:
        new clientPackets.RequestUseItem(this, payloadPacket);

        break;
      case 0x11:
        new clientPackets.RequestUnEquipItem(this, payloadPacket);

        break;
      case 0x36:
        new clientPackets.CanNotMoveAnymore(this, payloadPacket);

        break;
      case 0x1F:
        new clientPackets.RequestBuyItem(this, payloadPacket);

        break;
      case 0x6D:
        new clientPackets.RequestRestartPoint(this, payloadPacket);

        break;
      case 0x6B:
        new clientPackets.RequestAcquireSkillInfo(this, payloadPacket);

        break;
      case 0x6C:
        new clientPackets.RequestAcquireSkill(this, payloadPacket);

        break;
      case 0x12:
        new clientPackets.RequestDropItem(this, payloadPacket);

        break;
      case 0x59:
        new clientPackets.RequestDestroyItem(this, payloadPacket);

        break;
      case 0x64:
        new clientPackets.RequestDestroyQuest(this, payloadPacket);

        break;
      case 0x7D:
        new clientPackets.RequestTutorialQuestionMarkPressed(this, payloadPacket);

        break;
      case 0x7B:
        new clientPackets.RequestTutorialLinkHtml(this, payloadPacket);

        break;
      case 0xA8:
        new clientPackets.NetPing(this, payloadPacket);

        break;
      case 0x62:
        new clientPackets.RequestCharacterRestore(this, payloadPacket);

        break;
      case 0x4A:
        new clientPackets.StartRotating(this, payloadPacket);

        break;
      case 0x4B:
        new clientPackets.FinishRotating(this, payloadPacket);

        break;
      case 0x1C:
        new clientPackets.ChangeMoveType(this, payloadPacket);

        break;
      case 0x1D:
        new clientPackets.ChangeWaitType(this, payloadPacket);

        break;
    }
  }

  _onClose() {
    console.log("client disconnect from login server");
  }

  _init() {
    this._socket.setEncoding('binary');
    this._socket.on('error', () => {});
    this._socket.on('data', this._onData.bind(this));
    this._socket.on('close', this._onClose.bind(this));
  }
}

module.exports = Client;