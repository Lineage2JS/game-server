const ClientPacketNew = require('./ClientPacketNew');
const serverPackets = require('./../ServerPackets/serverPackets');

class RequestAttack extends ClientPacketNew {
  handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const x = this.readD();
    const y = this.readD();
    const z = this.readD();
    const attackId = this.readC(); // 0 - click, 1 - shift click

    const activeWeapon = player.getActiveWeapon();

    if (activeWeapon && activeWeapon.getWeaponType() === "bow") { // TODO temp for beta
      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }

    if (!player.isAttacking) {
      player.isAttacking = true;
      
      player.setAction('attack', objectId); // TODO setAction > doAction
    }
  }
}

module.exports = RequestAttack;