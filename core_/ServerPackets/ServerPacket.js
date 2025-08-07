// writeC - 1 byte
// writeH - 2 byte
// writeD - 4 byte
// writeF - 8 byte
// writeS - string

class ServerPacket {
  constructor() {
    this._buffer = Buffer.alloc(0);
    this._offset = 0;
  }

  writeC(value) {
    this._expandBuffer(1);
    this._buffer.writeUInt8(value, this._offset);
    this._offset++;

    return this;
  }

  writeH(value) {
    this._expandBuffer(2);
    this._buffer.writeUInt16LE(value, this._offset);
    this._offset += 2;

    return this;
  }

  writeD(value) {
    this._expandBuffer(4);
    this._buffer.writeInt32LE(value, this._offset);
    this._offset += 4;

    return this;
  }

  writeF(value) {
    this._expandBuffer(8);
    this._buffer.writeDoubleLE(value, this._offset);
    this._offset += 8;
      
    return this;
  }

  writeS(string) {
    const byteLength = Buffer.byteLength(string, 'ucs2') + 2;
  
    this._expandBuffer(byteLength);
    this._buffer.write(string, this._offset, 'ucs2');
    this._offset += byteLength - 2;
    this._buffer.writeInt16LE(0, this._offset);
    this._offset += 2;

    return this;
  }

  getBuffer() {
    // Вычисляем целевой размер: (текущий_размер + 4) должно быть кратно 8
    const targetSize = Math.ceil((this._offset + 4) / 8) * 8;
    const padding = targetSize - this._offset;

    // Если нужно добавить байты для выравнивания
    if (padding > 0) {
      this._expandBuffer(padding); // Расширяем буфер
      this._buffer.fill(0, this._offset, this._offset + padding); // Заполняем нулями
      
      this._offset += padding; // Увеличиваем смещение
    }

    return this._buffer.subarray(0, this._offset);
  }

  _expandBuffer(requiredBytes) {
    const newSize = this._offset + requiredBytes;
      
    if (newSize > this._buffer.length) {
      const newBuffer = Buffer.alloc(newSize);
        
      this._buffer.copy(newBuffer, 0, 0, this._offset);
      this._buffer = newBuffer;
    }
  }
}

module.exports = ServerPacket;