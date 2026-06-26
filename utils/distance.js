/** @typedef {{ x: number | null, y: number | null }} PositionedEntity */

/**
 * @param {PositionedEntity} entity1
 * @param {PositionedEntity} entity2
 * @returns {number}
 */
function calculateDistance(entity1, entity2) {
  const x1 = entity1?.x;
  const y1 = entity1?.y;
  const x2 = entity2?.x;
  const y2 = entity2?.y;

  const hasInvalidCoords =
    typeof x1 !== 'number' ||
    typeof y1 !== 'number' ||
    typeof x2 !== 'number' ||
    typeof y2 !== 'number' ||
    Number.isNaN(x1) ||
    Number.isNaN(y1) ||
    Number.isNaN(x2) ||
    Number.isNaN(y2);

  if (hasInvalidCoords) {
    return Number.POSITIVE_INFINITY;
  }

  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @param {PositionedEntity} entity1
 * @param {PositionedEntity} entity2
 * @param {number} range
 * @returns {boolean}
 */
function inRange(entity1, entity2, range) {
  return calculateDistance(entity1, entity2) < range;
}

module.exports = {
  calculateDistance,
  inRange,
};