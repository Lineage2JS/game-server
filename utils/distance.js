function calculateDistance(entity1, entity2) {
  const dx = entity1.x - entity2.x;
  const dy = entity1.y - entity2.y;
  
  return Math.sqrt(dx * dx + dy * dy);
}

function inRange(entity1, entity2, range) {
  return calculateDistance(entity1, entity2) < range;
}

module.exports = {
  calculateDistance,
  inRange,
};