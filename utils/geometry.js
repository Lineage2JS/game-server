const getRandomPointInPolygon = (points) => {
  let xp = points.map(i => i.x);
  let yp = points.map(i => i.y);
  let max = { x: Math.max(...xp), y: Math.max(...yp) };
  let min = { x: Math.min(...xp), y: Math.min(...yp) };
  let x;
  let y;
  
  do {
    x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
    y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
  } while(!isPointInPolygon(xp, yp, x, y))

  return [x, y];
}

const isPointInPolygon = (xp, yp, x, y) => {
  let npol = xp.length;
  let j = npol - 1;
  let c = false;

  for (let i = 0; i < npol; i++){
    if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
      (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
      c = !c
    }

    j = i;
  }

  return c;
}

module.exports = {
  getRandomPointInPolygon,
  isPointInPolygon,
};