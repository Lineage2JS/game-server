const levelToExp = require('./../datapack/levelToExp.json');

/** @type {Record<number, number>} */
const levelToExpTable = levelToExp;

/**
 * @param {number} exp
 * @returns {number}
 */
function expToLevel(exp) {
  let level = 1;
  
  for (let i = 1; i <= 60; i++) {
    if (exp >= levelToExpTable[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  return level;
}

module.exports = expToLevel;