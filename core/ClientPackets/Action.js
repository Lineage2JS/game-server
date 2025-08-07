const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const entitiesManager = require('./../Managers/EntitiesManager');
const playersManager = require('./../Managers/PlayersManager');
const npcHtmlMessagesManager = require('./../Managers/NpcHtmlMessagesManager');
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

    if (player.objectId === this.objectId) {
      this._client.sendPacket(new serverPackets.TargetSelected(this.objectId));

      player.target = this.objectId;
    }

    if (entity instanceof Npc) {
      if (entity.type === 'citizen' && player.target == null) {
        this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

        player.target = this.objectId;
        
        return;
      }

      if (entity.canBeAttacked === 0 && player.target !== entity.objectId) {
        this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));

        player.target = this.objectId;
        
        return;
      }

      if (entity.canBeAttacked === 0 && player.target === entity.objectId) {
        const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName(entity.ai.fnHi); // вызов через event TALKED shoPage(talker, fnHi) guard.ais
        
        if (htmlMessage) {
          this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
        } else {
          this._client.sendPacket(new serverPackets.NpcHtmlMessage(npcHtmlMessagesManager.getHtmlMessageByFileName("noquest.htm")));
        }

        this._client.sendPacket(new serverPackets.ActionFailed()); // fix?

        //
        player.lastTalkedNpcId = entity.id;
        //

        return;
      }

      if (entity.canBeAttacked === 1 && player.target !== null && !player.isAttacking) {
        player.isAttacking = true;

        player.updateJob('attack', this.objectId);
        return;
      }

      this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));
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

      player.target = this.objectId;
    }

    if (entity instanceof DropItem) {
      player.updateJob('pickup', entity);
    }
  }
}

module.exports = Action;