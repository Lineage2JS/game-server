const Warrior = require('./Warrior');

class WarriorFlee extends Warrior {
  onAttacked(attacker, damage) {
    this.addFleeDesire(attacker);
  }
}

module.exports = WarriorFlee;