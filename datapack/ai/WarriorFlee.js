const Warrior = require('./Warrior');

class WarriorFlee extends Warrior {
  /**
   * @param {*} attacker
   * @param {number} [damage]
   */
  onAttacked(attacker, damage) {
    this.addFleeDesire(attacker);
  }
}

module.exports = WarriorFlee;