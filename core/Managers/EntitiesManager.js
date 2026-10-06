const characterStatusEnums = require('./../../enums/characterStatusEnums');
const eventBusNew = require('./../Events/EventBusNew');

class EntitiesManager {
  constructor() {
    this._entities = [];
  }

  addEntity(entity) {
    this._entities.push(entity);
  }

  getEntityByObjectId(objectId) {
    return this._entities.find(entity => entity.objectId === objectId);
  }

  async enable() { // fix, load
    const npcManager = require('./NpcManager');
    const playersManager = require('./PlayersManager');
    const itemsManager = require('./ItemsManager');
    const botsManager = require('./BotsManager');
    const aiManager = require('./AiManager');
    const dropItemsManager = require('./DropItemsManager');
    const serverPackets = require('./../ServerPackets/serverPackets');

    //
    setInterval(() => {
      for (let i = 0; i < this._entities.length; i++) {
        const entity = this._entities[i];
        
        if (entity.update) {
          entity.update();
        }
      }
    }, 100);
    //

    npcManager.on('spawn', npc => {
      this._entities.push(npc);

      const packet = new serverPackets.NpcInfo(npc);
      
      playersManager.broadcastPacket(packet);
    });

    npcManager.on('move', async npc => {
      const path = {
        target: {
          x: npc.targetX,
          y: npc.targetY,
          z: npc.targetZ
        },
        origin: {
          x: npc.x,
          y: npc.y,
          z: npc.z
        }
      }
      const packet = new serverPackets.MoveToLocation(path, npc.objectId);
      
      playersManager.broadcastPacket(packet);
    });

    npcManager.on('attack', (npc, objectId) => {
      const entity = this.getEntityByObjectId(objectId);    
      const packet = new serverPackets.Attack(npc, npc.target);
      
      playersManager.broadcastPacket(packet);
    });

    npcManager.on('changeMove', npc => {
      const packet = new serverPackets.ChangeMoveType(npc.objectId, 1); // running
      
      playersManager.broadcastPacket(packet);
    });

    npcManager.on('stop', npc => {
      const packet = new serverPackets.StopMove(npc.objectId, npc.x, npc.y, npc.z);

      playersManager.broadcastPacket(packet);
    });

    npcManager.on('damaged', (npc) => {
      const packet = new serverPackets.StatusUpdate(npc.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: npc.hp,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: npc.maximumHp,
        }
      ]);

      playersManager.broadcastPacket(packet);
    });

    eventBusNew.on('player:enter', this._onPlayerEnter.bind(this));

    playersManager.on('updateExp', player => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.EXP,
          value: player.exp
        }
      ]);
      
      playersManager.broadcastPacket(packet);
    });

    playersManager.on('updateLevel', player => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.LEVEL,
          value: player.level,
        }
      ]);
      
      playersManager.broadcastPacket(packet);
      playersManager.broadcastPacket(new serverPackets.SocialAction(player.objectId, 15)); // fix
    });

    playersManager.on('pickup', (player, objectId) => {
      const dropItem = this.getEntityByObjectId(objectId);
      
      {
        const packet = new serverPackets.GetItem(player, dropItem); // fix Может подписатся на event окончание доставки пактеа?
      
        playersManager.broadcastPacket(packet);

        player.addItem(dropItem.getItem());
      }

      {
        playersManager.broadcastPacket(new serverPackets.ItemList(player.getItems()));
      }

      {
        const packet = new serverPackets.DeleteObject(dropItem.objectId);
      
        playersManager.broadcastPacket(packet);
      }
    });

    playersManager.on('regenerate', (player) => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: player.hp,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: player.maximumHp,
        },
        {
          id: characterStatusEnums.CUR_MP,
          value: player.mp,
        },
        {
          id: characterStatusEnums.MAX_MP,
          value: player.maximumMp,
        }
      ]);
    
      playersManager.broadcastPacket(packet);
    });

    playersManager.on('damaged', (player) => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: player.hp,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: player.maximumHp,
        }
      ]);
    
      playersManager.broadcastPacket(packet);
    });

    playersManager.on('died', (player) => {
      playersManager.broadcastPacket(new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: 0,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: player.maximumHp,
        }
      ]));
      playersManager.broadcastPacket(new serverPackets.Die(player.objectId));
    });

    playersManager.on('dropItem', async (player, objectId, x, y, z) => {
      const item = player.getItemByObjectId(objectId);

      player.deleteItemByObjectId(item.objectId);

      const droppedItem = await dropItemsManager.createDropItem(item, x, y, z);

      this._entities.push(droppedItem);

      playersManager.broadcastPacket(new serverPackets.ItemList(player.getItems()));
      playersManager.broadcastPacket(new serverPackets.DropItem(player, {
        objectId: droppedItem.objectId,
        itemId: droppedItem.itemId,
        x: droppedItem.x,
        y: droppedItem.y,
        z: droppedItem.z
      }));
    });

    playersManager.on('attack', async (player, targetObjectId) => {
      const packet = new serverPackets.Attack(player, targetObjectId, false);

      playersManager.broadcastPacket(packet);
    });

    playersManager.on('startAttack', async (player) => {
      const packet = new serverPackets.AutoAttackStart(player.objectId);

      playersManager.broadcastPacket(packet);
    });

    playersManager.on('endAttack', async (player) => {
      const packet = new serverPackets.AutoAttackStop(player.objectId);

      playersManager.broadcastPacket(packet);
    });

    playersManager.on('cast', async (player, skillId) => {
      const packet = new serverPackets.MagicSkillUse(player, {
        id: skillId,
        level: 1,
        hitTime: 4000, //1.08, // TODO
        reuseDelay: 6000 //13
      });

      playersManager.broadcastPacket(packet);

      {
        const packet = new serverPackets.MagicSkillLaunched(player, {
          id: skillId,
          level: 1
        });

        playersManager.broadcastPacket(packet);
      }

      playersManager.broadcastPacket(new serverPackets.SetupGauge(0, 4000));
    });

    botsManager.on('spawn', bot => {
      this._entities.push(bot);
    });

    botsManager.on('attack', bot => {
      const packet = new serverPackets.Attack(bot, bot.target);
      
      playersManager.broadcastPacket(packet);
    });

    botsManager.on('move', bot => {
      const path = {
        target: {
          x: bot.targetX,
          y: bot.targetY,
          z: bot.targetZ
        },
        origin: {
          x: bot.x,
          y: bot.y,
          z: bot.z
        }
      }
      
      const packet = new serverPackets.MoveToLocation(path, bot.objectId);
      
      playersManager.broadcastPacket(packet);
    });

    botsManager.on('pickup', (bot, item) => {
      {
        const packet = new serverPackets.GetItem(bot, item); // fix Может подписатся на event окончание доставки пактеа?
      
        playersManager.broadcastPacket(packet);
      }

      {
        const packet = new serverPackets.DeleteObject(item.objectId);
      
        playersManager.broadcastPacket(packet);
      }
    });

    aiManager.on('showPage', (talker, html) => {
      {
        const packet = new serverPackets.NpcHtmlMessage(html);
      
        playersManager.broadcastPacket(packet);
      }

      {
        const packet = new serverPackets.ActionFailed(); // fix?
      
        playersManager.broadcastPacket(packet);
      }
    });

    aiManager.on('setMemo', (talker, memo) => {
      talker.addQuest(memo); // memo - questId

      const packet = new serverPackets.QuestList(talker.getQuests());
    
      playersManager.broadcastPacket(packet);
    });

    aiManager.on('showQuestionMark', (talker, questionMarkId) => {
      const packet = new serverPackets.ShowTutorialMark(questionMarkId);
    
      playersManager.broadcastPacket(packet);
    });

    aiManager.on('showRadar', (talker, x, y, z) => {
      const packet = new serverPackets.ShowRadar(x, y, z);
    
      playersManager.broadcastPacket(packet);
    });

    aiManager.on('soundEffect', (talker, soundName) => {
      const packet = new serverPackets.PlaySound(soundName);
      
      playersManager.broadcastPacket(packet);
    });

    aiManager.on('giveItem', async (talker, itemName, itemCount) => {
      const itemId = itemsManager.getItemIdByName(itemName);
      const item = await itemsManager.createItem(itemId);

      talker.addItem(item);
      
      const items = talker.getItems();
      const packet = new serverPackets.ItemList(items);

      playersManager.broadcastPacket(packet);
    });

    aiManager.on('deleteItem', (talker, itemName, itemCount) => {
      talker.deleteItemByName(itemName);
      
      const items = talker.getItems();
      const packet = new serverPackets.ItemList(items);

      playersManager.broadcastPacket(packet);
    });

    aiManager.on('sell', async (talker, sellList, shopName, fnBuy) => {
      const items = [];

      for(let i = 0; i < sellList.length; i++) {
        const [itemName] = Object.keys(sellList[i]);
        const itemId = itemsManager.getItemIdByName(itemName);
        const item = await itemsManager.createItem(itemId);

        items.push(item);
      }

      const packet = new serverPackets.BuyList(talker.getAdenaCount(), items);

      playersManager.broadcastPacket(packet);
    });

    aiManager.on('showSkillList', async (talker) => {
      const packet = new serverPackets.AcquireSkillList([
        {
          id: 226,
          nextLevel: 1,
          maxLevel: 1,
          spCost: 100,
          requirements: 0
        }
      ]);

      playersManager.broadcastPacket(packet);
    });

    aiManager.on('teleport', async (talker, position) => {
      let teleportLinks = '';

      for(let i = 0; i < position.length; i++) {
        const pos = position[i];
        const [location, x, y, z, amount] = pos;
        const teleportLink = `<a action="bypass -h teleport ${x} ${y} ${z}">${location} - ${amount} Adena</a>`;

        teleportLinks += teleportLink;
      }

      const message = `<html><head><body>Region where teleporting is possible<br><br>${teleportLinks}</body></html>`;
      const packet = new serverPackets.NpcHtmlMessage(message);

      playersManager.broadcastPacket(packet);
    });
  }

  _onPlayerEnter(player) {
    this._entities.push(player);
  }
}

module.exports = new EntitiesManager();