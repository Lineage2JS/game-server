const EventEmitter = require('events');
const schedulerManager = require('./SchedulerManager');
const database = require('./../../database');
const serverPackets = require('./../ServerPackets/serverPackets');
const eventBusNew = require('./../Events/EventBusNew');

class PlayersManager extends EventEmitter {
  constructor() {
    super();
    
    this._players = [];
  }

  broadcastPacket(packet) {
    this._players.forEach(player => {
      const client = player.getClient();

      client.sendPacket(packet);
    })
  }

  getAllPlayers() {
    return this._players;
  }

  addPlayer(player) {
    this._players.push(player);

    player.on('move', (targetX, targetY, targetZ) => {
      const packet = new serverPackets.MoveToLocation(player.objectId, targetX, targetY, targetZ, player.x, player.y, player.z);
      
      this.broadcastPacket(packet);
      eventBusNew.emit('player:move', player);
    });

    player.on('pickup', (objectId) => {
      this.emit('pickup', player, objectId);
    });

    player.on('updateExp', () => {
      this.emit('updateExp', player);
    });

    player.on('updateLevel', () => {
      this.emit('updateLevel', player);
    });

    player.on('regenerate', () => {
      this.emit('regenerate', player);
    });

    player.on('dropItem', (objectId, x, y, z) => {
      this.emit('dropItem', player, objectId, x, y, z);
    });

    player.on('endMoving', () => {
      this.emit('endMoving', player);
    });

    player.on('attack', (targetObjectId) => {
      this.emit('attack', player, targetObjectId);
    });

    player.on('startAttack', () => {
      this.emit('startAttack', player);
    });

    player.on('endAttack', () => {
      this.emit('endAttack', player);
    });

    player.on('died', () => {
      this.emit('died', player);
    });

    player.on('damaged', () => {
      this.emit('damaged', player);
    });

    player.on('cast', (skillId) => {
      this.emit('cast', player, skillId);
    });
  }

  removePlayer(player) {
    const index = this._players.findIndex(playerItem => playerItem === player);

    if (index != -1) {
      this._players.splice(index, 1);
    }
  }

  getPlayerByClient(client) {
    const player = this._players.find((player) => {
      if (player.getClient() === client) {
        return true;
      } else {
        return false;
      }
    });

    return player;
  }

  async deleteCharacter(playerLogin, characterObjectId) {
    await schedulerManager.schedule({
      type: 'character-deletion',
      delay: 30000,
      payload: JSON.stringify({
        characterObjectId: characterObjectId
      }),
      createdBy: playerLogin
    });
  }

  async restoreCharacter(characterObjectId) { // fix взаимодействие через scheduler?
    await database.deleteScheduledTask('character-deletion', {"characterObjectId": characterObjectId});
  }
}

module.exports = new PlayersManager();