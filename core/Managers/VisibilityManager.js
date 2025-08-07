const npcManager = require('./NpcManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const botsManager = require('./BotsManager');

class VisibilityManager {
  constructor() {
    this._npcs = [];
    this._players = [];

    // listVisibleObjects
  }

  addPlayer(player) {
    this._players.push(player);
  }

  enable() {
    setInterval(() => {
      for (let i = 0; i < this._players.length; i++) {
        const player = this._players[i];
        const client = player.getClient();
        const spawnedNpcs = npcManager.getSpawnedNpcs();

        spawnedNpcs.forEach(npc => {
          //
          const dx = npc.x - player.x;
          const dy = npc.y - player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
        
          if (dist < 1500) {
            const packet = new serverPackets.NpcInfo(npc);

            client.sendPacket(packet);

            if (npc.state === 'move') {
              const path = {
                target: {
                  x: npc.path.target.x,
                  y: npc.path.target.y,
                  z: npc.z
                },
                origin: {
                  x: npc.x,
                  y: npc.y,
                  z: npc.z
                }
              }
      
              client.sendPacket(new serverPackets.MoveToLocation(path, npc.objectId));
            }
          } else {
            const packet = new serverPackets.DeleteObject(npc.objectId);

            client.sendPacket(packet);
          }
          //
        });

        botsManager._bots.forEach(bot => {
          const dx = bot.x - player.x;
          const dy = bot.y - player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 1500) {
            const packet = new serverPackets.CharacterInfo(bot);

            client.sendPacket(packet);

            if (bot.state === 'move') {
              const path = {
                target: {
                  x: bot.path.target.x,
                  y: bot.path.target.y,
                  z: bot.z
                },
                origin: {
                  x: bot.x,
                  y: bot.y,
                  z: bot.z
                }
              }
      
              client.sendPacket(new serverPackets.MoveToLocation(path, bot.objectId));
            }
          } else {
            const packet = new serverPackets.DeleteObject(bot.objectId);

            client.sendPacket(packet);
          }
        })
      }
    }, 3000);
  }
}

module.exports = new VisibilityManager();