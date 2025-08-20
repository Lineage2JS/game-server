const BaseState = require("./BaseState");

//
// const database = require('./../../database');
// const serverPackets = require('./../ServerPackets/serverPackets');
//

class MoveState extends BaseState {
  async enter() {
    this.character.path = this.payload;

    if (!this.character.isMoving) {
      this.character.emit('startedMoving');

      this.character.positionUpdateTimestamp = Date.now();
      this.character.isMoving = true;
    }

    if (this.character.job === 'move') {
      this.character.isAttacking = false;
    }

    //
    //this._objId = await database.getNextObjectId();
    //
  }

  update() {
    this.character.updatePosition(this.character.lastUpdateTimestamp);

    // this.character._client.sendPacket(new serverPackets.DropItem(this.character, {
    //   objectId: this._objId++,
    //   itemId: 57,
    //   x: this.character.x,
    //   y: this.character.y,
    //   z: this.character.z
    // }));
  }

  leave() {
    
  }
}

module.exports = MoveState;