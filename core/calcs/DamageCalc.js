class DamageCalc {
  calcDamage(attacker, target) {
    const damage = (attacker.getPAtk() * 70) / target.getStats().getPDef();
    
    return Math.floor(damage);
  }
}

module.exports = new DamageCalc();