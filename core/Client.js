// const XOR = require('./../utils/XOR.js');
// const xor = new XOR([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const clientPackets = require('./clientPackets/clientPackets');

/**
 * Реестр клиентских пакетов: opcode -> класс пакета.
 * Строится один раз из статического поля `code` каждого класса.
 * @type {Map<number, new (client: Client, packet: Buffer) => any>}
 */
const clientPacketsRegistry = new Map();

for (const PacketClass of Object.values(clientPackets)) {
  if (typeof PacketClass.code === 'number') {
    clientPacketsRegistry.set(PacketClass.code, PacketClass);
  }
}

class Client {
  /**
   * @param {import('net').Socket} socket
   */
  constructor(socket) {
    /** @type {import('net').Socket} */
    this._socket = socket;
    /** @type {number | null} */
    this._protocolVersion = null;
    /** @type {import('./Models/Player') | null} */
    this._player = null;

    this._init();
  }

  /** @returns {import('./Models/Player') | null} */
  getPlayer() {
    return this._player;
  }

  /**
   * @param {import('./Models/Player')} player
   */
  setPlayer(player) {
    this._player = player;
  }

  /**
   * @param {{ getBuffer: () => Buffer }} packetInstance
   * @param {boolean} [encoding=true]
   * @returns {void}
   */
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

  /** @param {number} value */
  setProtocolVersion(value) {
    this._protocolVersion = value;
  }
  
  /** @returns {number | null} */
  getProtocolVersion() {
    return this._protocolVersion;
  }

  /**
   * @param {Buffer} buffer
   * @returns {Buffer}
   */
  _getPacketLength(buffer) {
    const length = Buffer.from([0x00, 0x00]);
    
    length.writeInt16LE(buffer.length + 2);

    return length;
  }

  /**
   * @param {string | Buffer} data
   * @returns {Buffer}
   */
  _getCroppedPacket(data) {
    const buffer = typeof data === 'string'
      ? Buffer.from(data, 'binary')
      : Buffer.from(data);
    const croppedPacket = buffer.subarray(2);
    
    return croppedPacket;
  }

      /**
       * @param {Buffer} packet
       * @returns {Buffer}
       */
  _getDecryptedPacket(packet) {
    const decryptedPacket = packet; //blowfish.decrypt(packet);
    const buffer = Buffer.from(decryptedPacket);

    return buffer;
  }

  /**
   * @param {Buffer} packet
   * @returns {number}
   */
  _getOpcode(packet) {
    return packet[0];
  }

  /**
   * @param {Buffer} packet
   * @returns {Buffer}
   */
  _getPacketPayload(packet) {
    return packet.subarray(1);
  }

  /**
   * @param {string | Buffer} data
   * @returns {void}
   */
  _onData(data) {
    const croppedPacket = this._getCroppedPacket(data);
    const decryptedPacket = this._getDecryptedPacket(croppedPacket);
    const opcode = this._getOpcode(decryptedPacket);
    const packetPayload = this._getPacketPayload(decryptedPacket);

    console.log(`opcode: [0x${opcode.toString(16).toUpperCase().padStart(2, '0')}]`);

    const PacketClass = clientPacketsRegistry.get(opcode);

    if (!PacketClass) {
      return;
    }

    const packet = new PacketClass(this, packetPayload);

    if (typeof packet.handle === 'function') {
      packet.handle();
    }
  }

  /** @returns {void} */
  _onClose() {
    console.log("client disconnect from login server");
  }

  /** @returns {void} */
  _init() {
    this._socket.setEncoding('binary');
    this._socket.on('error', () => {});
    this._socket.on('data', this._onData.bind(this));
    this._socket.on('close', this._onClose.bind(this));
  }
}

module.exports = Client;