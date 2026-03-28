const ClientPacketNew = require("./ClientPacketNew");
const eventBusNew = require('./../Events/EventBusNew');

class EnterWorld extends ClientPacketNew {
  async handle() {
    const player = this.getPlayer();

    eventBusNew.emit('player:enter', player);
  }
}

module.exports = EnterWorld;