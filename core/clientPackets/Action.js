const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const entitiesManager = require('./../Managers/EntitiesManager');
const Player = require('./../Models/Player');
const Npc = require('./../Models/Npc');
const DropItem = require('./../Models/DropItem');
const Bot = require('./../Models/Bot');
const characterStatusEnums = require('./../../enums/characterStatusEnums');

class Action extends ClientPacketNew {
  handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const objectId = this.readD();
    const originX = this.readD();
    const originY = this.readD();
    const originZ = this.readD();
    const actionId = this.readC(); // 0 - click, 1 - shift click
    const entity = entitiesManager.getEntityByObjectId(objectId);

    if (entity instanceof Player) {
      // TODO\
      client.sendPacket(new serverPackets.StatusUpdate(entity.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: entity.hp,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: entity.maximumHp,
        }
      ]));

      if (player.target === null) { // TODO if entity not dead
        client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

        player.target = entity.objectId;

        return;
      }

      if (player.target !== entity.objectId) {
        client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

        player.target = entity.objectId;

        return;
      }

      return;
    }

    if (entity instanceof Npc) {
      client.sendPacket(new serverPackets.StatusUpdate(entity.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: entity.hp,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: entity.maximumHp,
        }
      ]));

      if (player.target === null) { // TODO if entity not dead
        client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

        player.target = entity.objectId;

        return;
      }

      if (player.target !== entity.objectId) {
        client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

        player.target = entity.objectId;

        return;
      }

      if (entity.canBeAttacked === 0) {
        player.doAction('talk', entity.objectId);

        return;
      }

      if (!player.isAttacking && !entity.isDead && entity.canBeAttacked === 1) {
        player.doAction('attack', entity.objectId);

        return;
      }

      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }

    if (entity instanceof DropItem) {
      player.doAction('pickup', entity.objectId);

      return;
    }

    if (entity instanceof Bot) {
      client.sendPacket(new serverPackets.ActionFailed());

      return;
    }
  }
}

module.exports = Action;