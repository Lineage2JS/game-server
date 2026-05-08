const npcManager = require('./NpcManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const botsManager = require('./BotsManager');
const eventBusNew = require('./../Events/EventBusNew');

class VisibilityManager {
  constructor() {
    //this._npcs = [];
    this._players = [];

    // listVisibleObjects
    this._VISIBILITY_RANGE = 1500;
    this._UPDATE_INTERVAL_MS = 3000;

    eventBusNew.on('player:enter', this._onPlayerEnter.bind(this));
  }

  addPlayer(player) {
    this._players.push(player);
  }

  enable() {
    this._update();
  }

  _onPlayerEnter(player) {
    this._players.push(player);
  }
  
  _update() {
    for (let i = 0; i < this._players.length; i++) {
      const player = this._players[i];
      const client = player.getClient();
      const spawnedNpcs = npcManager.getSpawnedNpcs();

      spawnedNpcs.forEach(npc => {        
        if (this._isObjectVisible(npc, player)) {
          const packet = new serverPackets.NpcInfo(npc);

          client.sendPacket(packet);

          if (npc.state === 'move') {
            const path = this._createMovePath(npc);
    
            client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));
          }
        } else {
          const packet = new serverPackets.DeleteObject(npc.objectId);

          client.sendPacket(packet);

          // TODO remove target
          if (player.target === npc.objectId) {
            player.target = null;
          }
          //
        }
        //
      });

      botsManager._bots.forEach(bot => {
        if (this._isObjectVisible(bot, player)) {
          const packet = new serverPackets.CharacterInfo(bot);

          client.sendPacket(packet);

          if (bot.state === 'move') {
            const path = this._createMovePath(bot);
    
            client.sendPacket(new serverPackets.MoveToLocation(path, bot.objectId));
          }
        } else {
          const packet = new serverPackets.DeleteObject(bot.objectId);

          client.sendPacket(packet);

          // TODO remove target
          if (player.target === bot.objectId) {
            player.target = null;
          }
          //
        }
      })
    }

    setTimeout(() => {
      this._update();
    }, this._UPDATE_INTERVAL_MS);
  }

  _calculateDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }

  _isObjectVisible(obj1, obj2) {
    return this._calculateDistance(obj1, obj2) < this._VISIBILITY_RANGE;
  }

  _createMovePath(object) {
    const path = {
      target: {
        x: object.targetX,
        y: object.targetY,
        z: object.targetZ
      },
      origin: {
        x: object.x,
        y: object.y,
        z: object.z
      }
    }

    return path;
  }
}

module.exports = new VisibilityManager();