const damageCalc = require('./../calcs/DamageCalc');
const serverPackets = require('../ServerPackets/serverPackets');

class PlayerAttackHandler {
  handle(data) {
    const attacker = data.attacker;
    const target = data.target;

    if (target.isDead) {
      return;
    }
    
    const damage = damageCalc.calcDamage(attacker, target);

    target.takeDamage(damage);
    target.recordHit(attacker, damage);

    const client = attacker.getClient();

    client.sendPacket(new serverPackets.SystemMessage(35, [
      {
        type: 1,
        value: damage
      }
    ]));

    // eventBusNew.emit('npc:attacked', { npc: target, attacker, damage });
  }
}

module.exports = PlayerAttackHandler;