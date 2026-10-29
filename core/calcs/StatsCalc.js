const BASE_FIGHTER_PATK = 4;
const baseStats = require('./../../datapack/baseStats.json');

class StatsCalc {
  calcPAtk(character) {
    if (character.hand.right.itemId === 0) {
      return BASE_FIGHTER_PATK;
    }

    const item = character.getItemByObjectId(character.hand.right.objectId);

    if (!item) {
      return 0;
    }

    const weaponPAtk = item.getPhysicalDamage();
    const levelModifier = (character.level + 89) / 100;
    const strModifier = baseStats.STR[character.getBaseStats().getStr()];
    const masteryModifier = 1;
    const armorBonus = 1;
    const mDefBonus = 1;
    const buffsType1 = 1;
    const weaponMastery = 0;
    const buffsType2 = 0;
    const weaponBonus = 0;
    const pAtk = (weaponPAtk * levelModifier * strModifier * masteryModifier * armorBonus  * mDefBonus * buffsType1) + weaponMastery + buffsType2 + weaponBonus;

    return Math.floor(pAtk);
  }

  calcMSpd(character) {
    const witModifier = baseStats.WIT[character.getBaseStats().getWit()];
    const mSpd = (333 * witModifier);

    return Math.floor(mSpd);
  }
}

module.exports = new StatsCalc();