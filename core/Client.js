// const XOR = require('./../utils/XOR.js');
// const xor = new XOR([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const clientPackets = require('./clientPackets/clientPackets');

class Client {
  constructor(socket) {
    this._socket = socket;
    this._protocolVersion = null;
    this._player = null;
    
    this._init();
  }

  getPlayer() {
    return this._player;
  }

  setPlayer(player) {
    this._player = player;
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

  _getPacketPayload(packet) {
    return packet.subarray(1);
  }

  _onData(data) {
    const croppedPacket = this._getCroppedPacket(data);
    const decryptedPacket = this._getDecryptedPacket(croppedPacket);
    const opcode = this._getOpcode(decryptedPacket);
    const packetPayload = this._getPacketPayload(decryptedPacket);
    let packet;

    console.log(`opcode: [0x${opcode.toString(16).toUpperCase().padStart(2, '0')}]`);

    switch(opcode) {
      case 0x00:
        packet = new clientPackets.SendProtocolVersion(this, packetPayload);

        break;
      case 0x04:
        packet = new clientPackets.Action(this, packetPayload);

        break;
      case 0x08:
        packet = new clientPackets.RequestAuthLogin(this, packetPayload);

        break;
      case 0x0D:
        packet = new clientPackets.RequestGameStart(this, packetPayload);

        break;
      case 0x63:
        packet = new clientPackets.RequestQuestList(this, packetPayload);

        break;
      case 0x03:
        packet = new clientPackets.EnterWorld(this, packetPayload);
  
        break;
      case 0x0E:
        packet = new clientPackets.NewCharacter(this, packetPayload);

        break;
      case 0x0B:
        packet = new clientPackets.RequestCharacterCreate(this, packetPayload);

        break;
      case 0x0C:
        packet = new clientPackets.RequestCharacterDelete(this, packetPayload);

        break;
      case 0x01:
        packet = new clientPackets.MoveBackwardToLocation(this, packetPayload);
  
        break;
      case 0x0A:
        packet = new clientPackets.RequestAttack(this, packetPayload);

        break;
      case 0x09:
        packet = new clientPackets.Logout(this, packetPayload);
  
        break;
      case 0x46:
        packet = new clientPackets.RequestRestart(this, packetPayload);

        break;
      case 0x37:
        packet = new clientPackets.RequestTargetCancel(this, packetPayload);

        break;
      case 0x0F:
        packet = new clientPackets.RequestItemList(this, packetPayload);

        break;
      case 0x33:
        packet = new clientPackets.RequestShortCutReg(this, packetPayload);

        break;
      case 0x21:
        packet = new clientPackets.RequestBypassToServer(this, packetPayload);

        break;
      case 0x3F:
        packet = new clientPackets.RequestSkillList(this, packetPayload);

        break;
      case 0x2F:
        packet = new clientPackets.RequestMagicSkillUse(this, packetPayload);

        break;
      case 0x57:
        packet = new clientPackets.RequestShowBoard(this, packetPayload);

        break;
      case 0x1B:
        packet = new clientPackets.RequestSocialAction(this, packetPayload);

        break;
      case 0x48:
        packet = new clientPackets.ValidatePosition(this, packetPayload);

        break;
      case 0x45:
        packet = new clientPackets.RequestActionUse(this, packetPayload);

        break;
      case 0x38:
        packet = new clientPackets.Say2(this, packetPayload);

        break;
      case 0x5B:
        packet = new clientPackets.SendBypassBuildCmd(this, packetPayload);

        break;
      case 0x20:
        packet = new clientPackets.RequestLinkHtml(this, packetPayload);
  
        break;
      case 0x14:
        packet = new clientPackets.RequestUseItem(this, packetPayload);

        break;
      case 0x11:
        packet = new clientPackets.RequestUnEquipItem(this, packetPayload);

        break;
      case 0x36:
        packet = new clientPackets.CanNotMoveAnymore(this, packetPayload);

        break;
      case 0x1F:
        packet = new clientPackets.RequestBuyItem(this, packetPayload);

        break;
      case 0x6D:
        new clientPackets.RequestRestartPoint(this, packetPayload);

        break;
      case 0x6B:
        packet = new clientPackets.RequestAcquireSkillInfo(this, packetPayload);

        break;
      case 0x6C:
        packet = new clientPackets.RequestAcquireSkill(this, packetPayload);

        break;
      case 0x12:
        packet = new clientPackets.RequestDropItem(this, packetPayload);

        break;
      case 0x59:
        packet = new clientPackets.RequestDestroyItem(this, packetPayload);

        break;
      case 0x64:
        new clientPackets.RequestDestroyQuest(this, packetPayload);

        break;
      case 0x7D:
        new clientPackets.RequestTutorialQuestionMarkPressed(this, packetPayload);

        break;
      case 0x7B:
        new clientPackets.RequestTutorialLinkHtml(this, packetPayload);

        break;
      case 0xA8:
        packet = new clientPackets.NetPing(this, packetPayload);

        break;
      case 0x62:
        packet = new clientPackets.RequestCharacterRestore(this, packetPayload);

        break;
      case 0x4A:
        packet = new clientPackets.StartRotating(this, packetPayload);

        break;
      case 0x4B:
        packet = new clientPackets.FinishRotating(this, packetPayload);

        break;
      case 0x1C:
        packet = new clientPackets.ChangeMoveType(this, packetPayload);

        break;
      case 0x1D:
        packet = new clientPackets.ChangeWaitType(this, packetPayload);

        break;
    }

    if (!packet) {
      return;
    }

    packet.handle();
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