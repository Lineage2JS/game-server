const BaseState = require("./BaseState");

//
const npcManager = require('./../Managers/NpcManager');
const serverPackets = require('./../ServerPackets/serverPackets');
//

class AttackState extends BaseState {
  enter() {
      
  }

  update() {
    if ((Date.now() - this.character.lastAttackTimestamp) > (500000 / 330)) {
      const npc = npcManager.getNpcByObjectId(this.payload);
      const path = {
        target: {
          x: npc.x,
          y: npc.y,
          z: npc.z
        },
        origin: {
          x: this.character.x,
          y: this.character.y,
          z: this.character.z
        }
      }
  
      this.character.path = path;
  
      const dx = this.character.path.target.x - this.character.x;
      const dy = this.character.path.target.y - this.character.y;
      const distance = Math.sqrt(dx * dx + dy * dy) - 20;
  
      if (distance > 29) { // 29 - attack range + collision radius
        this.character.setState('follow', this.character.path);
  
        return;
      }
      
      this.character.lastAttackTimestamp = Date.now();
  
      this.character._client.sendPacket(new serverPackets.Attack(this.character, npc.objectId, this.character._activeSoulShot));
  
      this.character._activeSoulShot = false;
    }
  }

  leave() {
    
  }
}

module.exports = AttackState;