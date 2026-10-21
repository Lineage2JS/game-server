class DamageCalc {
  calcDamage(attacker, target) {
    const damage = (attacker.getPAtk() * 70) * target.getPDef();
console.log('damange', damage)
    return Math.floor(damage);
  }
}

module.exports = new DamageCalc();