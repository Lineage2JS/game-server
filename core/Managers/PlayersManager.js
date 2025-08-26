const EventEmitter = require('events');
const schedulerManager = require('./SchedulerManager');
const database = require('./../../database');

class PlayersManager extends EventEmitter {
  constructor() {
    super();
    
    this._players = [];

    this.on('notify', packet => { // nofity = send, broadcast? fix
      this._players.forEach(player => {
        const client = player.getClient();

        client.sendPacket(packet);
      })
    });

    schedulerManager.on('completed', async (task) => {
      if (task.type === 'character-deletion') {
        await database.deleteCharacter(task.payload.characterObjectId);
        await database.deleteCharacterInventory(task.payload.characterObjectId);
      }
    });
  }

  add(player) {
    this._players.push(player);

    player.on('move', () => {
      this.emit('move', player);
    })

    player.on('pickup', (item) => {
      this.emit('pickup', player, item); // fix?
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

    player.on('startedMoving', () => {
      this.emit('startedMoving', player);
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
    const task = {
      type: 'character-deletion',
      status: 'new',
      payload: JSON.stringify({
        characterObjectId: characterObjectId
      }),
      scheduledAt: Date.now() + 30000,
      createdAccountId: playerLogin,
      createdType: 'user'
    }

    await schedulerManager.createTask(task);
  }

  async restoreCharacter(characterObjectId) { // fix взаимодействие через scheduler?
    await database.deleteScheduledTask('character-deletion', {"characterObjectId": characterObjectId});
  }
}

module.exports = new PlayersManager();