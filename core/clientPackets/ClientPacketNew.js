// readC - 1 byte
// readH - 2 byte
// readD - 4 byte
// readF - 8 byte
// readB - string
// readS - string

class ClientPacketNew {
  constructor(client, buffer) {
    this._client = client;
    this._player = client.getPlayer();
    this._buffer = buffer;
    this._offset = 0;
  }

  getClient() {
    return this._client;
  }

  getPlayer() {
    return this._player;
  }

  readC() {
    const value = this._buffer.readUInt8(this._offset);

    this._offset++;

    return value;
  }

  readH() {
    const value = this._buffer.readUInt16LE(this._offset);

    this._offset += 2;

    return value;
  }

  readD() {
    const value = this._buffer.readInt32LE(this._offset);

    this._offset += 4;

    return value;
  }

  readF() {
    const value = this._buffer.readDoubleLE(this._offset);

    this._offset += 8;

    return value;
  }

  readB(length) {
    const value = this._buffer.slice(this._offset, this._offset + length);

    this._offset += length;

    return value;
  }

  readS() {
    let i;
    
    for (i = this._offset; i < this._buffer.length; i += 2) {
      if (this._buffer.readUInt16LE(i) === 0x00) {
        break;
      }
    }

    const value = this._buffer.toString("ucs2", this._offset, i);
    const bytesRead = i - this._offset + 2; // +2 for null terminator
    
    this._offset += bytesRead;

    return value;
  }
}

module.exports = ClientPacketNew;