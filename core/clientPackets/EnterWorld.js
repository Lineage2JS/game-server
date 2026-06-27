const ClientPacketNew = require("./ClientPacketNew");
const eventBusNew = require('./../Events/EventBusNew');

class EnterWorld extends ClientPacketNew {
  static code = 0x03;

  async handle() {
    const player = this.getPlayer();

    if (!player) return;

    eventBusNew.emit('player:enter', player);
  }
}

module.exports = EnterWorld;