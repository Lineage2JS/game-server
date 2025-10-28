const characterStatusEnums = require('./../../enums/characterStatusEnums');

class EntitiesManager {
  constructor() {
    this._entities = [];
  }

  getEntityByObjectId(objectId) {
    return this._entities.find(entity => entity.objectId === objectId);
  }

  getEntityById(id) {
    return this._entities.find(entity => entity.id === id);
  }

  async enable() { // fix, load
    const npcManager = require('./NpcManager');
    const playersManager = require('./PlayersManager');
    const itemsManager = require('./ItemsManager');
    const botsManager = require('./BotsManager');
    const visibilityManager = require('./VisibilityManager');
    const announcementsManager = require('./AnnouncementsManager');
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
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('move', npc => {
      const packet = new serverPackets.MoveToLocation(npc.path, npc.objectId);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('attack', (npc, objectId) => {
      const entity = this.getEntityByObjectId(objectId);    
      const packet = new serverPackets.Attack(npc, npc.target);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('changeMove', npc => {
      const packet = new serverPackets.ChangeMoveType(npc.objectId, 1); // running
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('stop', npc => {
      const packet = new serverPackets.StopMove(npc.objectId, npc.x, npc.y, npc.z);

      playersManager.emit('notify', packet);
    });

    npcManager.on('died', async npc => {
      playersManager.emit('notify', new serverPackets.StatusUpdate(npc.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: 0,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: npc.maximumHp,
        }
      ]));
      playersManager.emit('notify', new serverPackets.Die(npc.objectId));

      setTimeout(() => {
        playersManager.emit('notify', new serverPackets.DeleteObject(npc.objectId));
      }, 3000);
    });

    npcManager.on('dropItems', async (npc, drop) => {
      console.log(npc.id, drop); // fix drop name var?  

      const itemId = itemsManager.getItemIdByName(drop.itemName);
      const createdItem = await itemsManager.createItem(itemId);
      const droppedItem = await dropItemsManager.createDropItem(createdItem, npc.x, npc.y, npc.z + 300);

      this._entities.push(droppedItem);

      playersManager.emit('notify', new serverPackets.DropItem(npc, {
        objectId: droppedItem.objectId,
        itemId: droppedItem.itemId,
        x: droppedItem.x,
        y: droppedItem.y,
        z: droppedItem.z
      }));
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

      playersManager.emit('notify', packet);
    });

    playersManager.on('spawn', player => {
      this._entities.push(player);

      visibilityManager.addPlayer(player);

      const announcements = announcementsManager.getAnnouncements();

      announcements.forEach(announcement => {
        const packet = new serverPackets.CreateSay(0, player.characterName, 10, announcement); // TODO ANNOUNCEMENT = 10
      
        playersManager.emit('notify', packet);
      });      
    });

    playersManager.on('move', player => {
      const packet = new serverPackets.MoveToLocation(player.path, player.objectId);
      
      playersManager.emit('notify', packet);
    });

    playersManager.on('updateExp', player => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.EXP,
          value: player.exp
        }
      ]);
      
      playersManager.emit('notify', packet);
    });

    playersManager.on('updateLevel', player => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.LEVEL,
          value: player.level,
        }
      ]);
      
      playersManager.emit('notify', packet);

      playersManager.emit('notify', new serverPackets.SocialAction(player.objectId, 15)); // fix
    });

    playersManager.on('pickup', (player, dropItem) => {
      {
        const packet = new serverPackets.GetItem(player, dropItem); // fix Может подписатся на event окончание доставки пактеа?
      
        playersManager.emit('notify', packet);

        player.addItem(dropItem.getItem());
      }

      {
        playersManager.emit('notify', new serverPackets.ItemList(player.getItems()));
      }

      {
        const packet = new serverPackets.DeleteObject(dropItem.objectId);
      
        playersManager.emit('notify', packet);
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
    
      playersManager.emit('notify', packet);
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
    
      playersManager.emit('notify', packet);
    });

    playersManager.on('died', (player) => {
      playersManager.emit('notify', new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: 0,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: player.maximumHp,
        }
      ]));
      playersManager.emit('notify', new serverPackets.Die(player.objectId));
    });

    playersManager.on('dropItem', async (player, objectId, x, y, z) => {
      const item = player.getItemByObjectId(objectId);

      player.deleteItemByObjectId(item.objectId);

      const droppedItem = await dropItemsManager.createDropItem(item, x, y, z);

      this._entities.push(droppedItem);

      playersManager.emit('notify', new serverPackets.ItemList(player.getItems()));
      playersManager.emit('notify', new serverPackets.DropItem(player, {
        objectId: droppedItem.objectId,
        itemId: droppedItem.itemId,
        x: droppedItem.x,
        y: droppedItem.y,
        z: droppedItem.z
      }));
    });

    playersManager.on('attack', async (player, targetObjectId) => {
      const packet = new serverPackets.Attack(player, targetObjectId, false);

      playersManager.emit('notify', packet);
    });

    playersManager.on('startAttack', async (player) => {
      const packet = new serverPackets.AutoAttackStart(player.objectId);

      playersManager.emit('notify', packet);
    });

    playersManager.on('endAttack', async (player) => {
      const packet = new serverPackets.AutoAttackStop(player.objectId);

      playersManager.emit('notify', packet);
    });

    playersManager.on('cast', async (player, skillId) => {
      const packet = new serverPackets.MagicSkillUse(player, {
        id: skillId,
        level: 1,
        hitTime: 4000, //1.08, // TODO
        reuseDelay: 6000 //13
      });

      playersManager.emit('notify', packet);

      {
        const packet = new serverPackets.MagicSkillLaunched(player, {
          id: skillId,
          level: 1
        });

        playersManager.emit('notify', packet);
      }

      playersManager.emit('notify', new serverPackets.SetupGauge(0, 4000));
    });

    botsManager.on('spawn', bot => {
      this._entities.push(bot);
    });

    botsManager.on('attack', bot => {
      const packet = new serverPackets.Attack(bot, bot.target);
      
      playersManager.emit('notify', packet);
    });

    botsManager.on('move', bot => {
      const packet = new serverPackets.MoveToLocation(bot.path, bot.objectId);
      
      playersManager.emit('notify', packet);
    });

    botsManager.on('pickup', (bot, item) => {
      {
        const packet = new serverPackets.GetItem(bot, item); // fix Может подписатся на event окончание доставки пактеа?
      
        playersManager.emit('notify', packet);
      }

      {
        const packet = new serverPackets.DeleteObject(item.objectId);
      
        playersManager.emit('notify', packet);
      }
    });

    aiManager.on('showPage', (talker, html) => {
      {
        const packet = new serverPackets.NpcHtmlMessage(html);
      
        playersManager.emit('notify', packet);
      }

      {
        const packet = new serverPackets.ActionFailed(); // fix?
      
        playersManager.emit('notify', packet);
      }
    });

    aiManager.on('setMemo', (talker, memo) => {
      talker.addQuest(memo); // memo - questId

      const packet = new serverPackets.QuestList(talker.getQuests());
    
      playersManager.emit('notify', packet);
    });

    aiManager.on('showQuestionMark', (talker, questionMarkId) => {
      const packet = new serverPackets.ShowTutorialMark(questionMarkId);
    
      playersManager.emit('notify', packet);
    });

    aiManager.on('showRadar', (talker, x, y, z) => {
      const packet = new serverPackets.ShowRadar(x, y, z);
    
      playersManager.emit('notify', packet);
    });

    aiManager.on('soundEffect', (talker, soundName) => {
      const packet = new serverPackets.PlaySound(soundName);
      
      playersManager.emit('notify', packet);
    });

    aiManager.on('giveItem', async (talker, itemName, itemCount) => {
      const itemId = itemsManager.getItemIdByName(itemName);
      const item = await itemsManager.createItem(itemId);

      talker.addItem(item);
      
      const items = talker.getItems();
      const packet = new serverPackets.ItemList(items);

      playersManager.emit('notify', packet);
    });

    aiManager.on('deleteItem', (talker, itemName, itemCount) => {
      talker.deleteItemByName(itemName);
      
      const items = talker.getItems();
      const packet = new serverPackets.ItemList(items);

      playersManager.emit('notify', packet);
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

      playersManager.emit('notify', packet);
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

      playersManager.emit('notify', packet);
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

      playersManager.emit('notify', packet);
    });
  }
}

module.exports = new EntitiesManager();