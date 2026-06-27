const npcManager = require('./NpcManager');
const serverPackets = require('./../ServerPackets/serverPackets');
const botsManager = require('./BotsManager');
const eventBusNew = require('./../Events/EventBusNew');
const { calculateDistance } = require('./../../utils/distance');

/** @typedef {import('../Models/Player')} Player */
/** @typedef {{ x: number | null, y: number | null, z: number | null, targetX?: number | null, targetY?: number | null, targetZ?: number | null, objectId?: number | null }} VisibleObject */
/** @typedef {{ target: { x: number | null | undefined, y: number | null | undefined, z: number | null | undefined }, origin: { x: number | null | undefined, y: number | null | undefined, z: number | null | undefined } }} MovePath */

class VisibilityManager {
  constructor() {
    //this._npcs = [];
    /** @type {Player[]} */
    this._players = [];

    // listVisibleObjects
    /** @type {number} */
    this._VISIBILITY_RANGE = 1500;
    /** @type {number} */
    this._UPDATE_INTERVAL_MS = 3000;

    eventBusNew.on('player:enter', this._onPlayerEnter.bind(this));
  }

  /** @param {Player} player */
  addPlayer(player) {
    this._players.push(player);
  }

  /** @returns {void} */
  enable() {
    this._update();
  }

  /** @param {Player} player */
  _onPlayerEnter(player) {
    this._players.push(player);
  }

  /** @returns {void} */
  _update() {
    for (let i = 0; i < this._players.length; i++) {
      const player = this._players[i];
      const client = player.getClient();
      if (!client) {
        continue;
      }
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

  /**
   * @param {VisibleObject} obj1
   * @param {VisibleObject} obj2
   * @returns {boolean}
   */
  _isObjectVisible(obj1, obj2) {
    return calculateDistance(obj1, obj2) < this._VISIBILITY_RANGE;
  }

  /**
   * @param {VisibleObject} object
   * @returns {MovePath}
   */
  _createMovePath(object) {
    /** @type {MovePath} */
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