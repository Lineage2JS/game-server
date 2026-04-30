const levelToExp = require('./../datapack/levelToExp.json');

function expToLevel(exp) {
  let level = 1;
  
  for (let i = 1; i <= 60; i++) {
    if (exp >= levelToExp[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  return level;
}

module.exports = expToLevel;