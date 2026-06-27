module.exports = new Map(
  [
    ['humanFighter', 0],
    ['humanMagician', 10],
    ['elfFighter', 18],
    ['elfMagician', 25],
    ['darkelfFighter', 31],
    ['darkelfMagician', 38],
    ['orcFighter', 44],
    ['orcShaman', 49],
    ['dwarfApprentice', 53],
  ]
);

const classIdsEnum = module.exports;

/**
 * @param {number} classId
 * @returns {string | null}
 */
module.exports.getClassNameById = function(classId) {
  for (const [key, value] of classIdsEnum.entries()) {
    if (value === classId) {
      return key;
    }
  }

  return null;
}

/**
 * @param {string} className
 * @returns {number | null}
 */
module.exports.getClassIdByName = function(className) {
  return classIdsEnum.get(className) || null;
}

/**
 * @returns {string[]}
 */
module.exports.getAllClassNames = function() {
  return Array.from(classIdsEnum.keys());
}

/**
 * @returns {number[]}
 */
module.exports.getAllClassIds = function() {
  return Array.from(classIdsEnum.values());
}

/**
 * @returns {string[]}
 */
module.exports.getMagicianClassNames = function() {
  return ['humanMagician', 'elfMagician', 'darkelfMagician'];
}
