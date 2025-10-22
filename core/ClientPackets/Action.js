const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const entitiesManager = require('./../Managers/EntitiesManager');
const playersManager = require('./../Managers/PlayersManager');
const Player = require('./../Models/Player');
const Npc = require('./../Models/Npc');
const DropItem = require('./../Models/DropItem');
const characterStatusEnums = require('./../../enums/characterStatusEnums');

class Action {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readD()
      .readD()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get objectId() {
    return this._data.getData()[0];
  }

  get originX() {
    return this._data.getData()[1];
  }

  get originY() {
    return this._data.getData()[2];
  }

  get originZ() {
    return this._data.getData()[3];
  }

  get actionId() {
    return this._data.getData()[4]; // 0 - click, 1 - shift click
  }

  _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const entity = entitiesManager.getEntityByObjectId(this.objectId);

    if (player.target === null) { // TODO if entity not dead
      this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

      player.target = entity.objectId;

      return;
    }

    if (player.target !== entity.objectId) {
      this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

      player.target = entity.objectId;

      return;
    }

    if (entity instanceof Player) {
      
      return;
    }

    if (entity instanceof Npc) {
      if (entity.canBeAttacked === 0) {
        const path = {
          target: {
            x: entity.x,
            y: entity.y,
            z: entity.z
          },
          origin: {
            x: player.x,
            y: player.y,
            z: player.z
          }
        }
    
        //
        player.lastTalkedNpcId = entity.id; // fix pack to method setLastTalkedNpcId()
        //
        player.path = path;
        player.job = 'talk';
        player.changeState('follow', player.path);

        this._client.sendPacket(new serverPackets.ActionFailed()); // fix?

        return;
      }

      if (entity.canBeAttacked === 1 && !player.isAttacking) { // TODO isAttacking опирается на state
        this._client.sendPacket(new serverPackets.StatusUpdate(entity.objectId, [
          {
            id: characterStatusEnums.CUR_HP,
            value: entity.hp,
          },
          {
            id: characterStatusEnums.MAX_HP,
            value: entity.maximumHp,
          }
        ]));
        
        player.isAttacking = true;

        player.updateJob('attack', this.objectId);

        return;
      }

      return;
    }

    if (entity instanceof DropItem) {
      player.updateJob('pickup', entity);
    }
  }
}

module.exports = Action;