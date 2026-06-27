const ClientPacketNew = require('./ClientPacketNew');
const serverPackets = require('./../ServerPackets/serverPackets');
const entitiesManager = require('./../Managers/EntitiesManager');
const Player = require('./../Models/Player');
const Npc = require('./../Models/Npc');

class RequestAttack extends ClientPacketNew {
  static code = 0x0A;

  handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const x = this.readD();
    const y = this.readD();
    const z = this.readD();
    const attackId = this.readC(); // 0 - click, 1 - shift click
    const entity = entitiesManager.getEntityByObjectId(objectId);

    if (!player || !entity) return;

    const activeWeapon = player.getActiveWeapon();

    if (activeWeapon && activeWeapon.getWeaponType() === "bow") { // TODO temp for beta
      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }

    if (!player.isAttacking && !entity.isDead && entity.canBeAttacked === 1) {
      player.doAction('attack', entity.objectId);

      return;
    }

    client.sendPacket(new serverPackets.ActionFailed());
  }
}

module.exports = RequestAttack;