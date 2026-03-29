const ClientPacketNew = require("./ClientPacketNew");

class ValidatePosition extends ClientPacketNew {
  async handle() {
    const x = this.readD();
    const y = this.readD();
    const z = this.readD();
    const heading = this.readD();
    // TODO
  }
}

module.exports = ValidatePosition;