const ClientPacketNew = require("./ClientPacketNew");
const eventBusNew = require('./../Events/EventBusNew');

class Logout extends ClientPacketNew {
  async handle() {
    const player = this.getPlayer();

    eventBusNew.emit('player:exit', player);
  }
}

module.exports = Logout;