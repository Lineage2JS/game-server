const DefaultBot = require('./DefaultBot');

class RunningBot extends DefaultBot {
  created() {
    const waypoints = [
      [{ x: -84999, y: 243217 }, { x: -84652, y: 242917 }, { x: -84382, y: 243289 }, { x: -84883, y: 243651 }],
      [{ x: -84521, y: 242841 }, { x: -84367, y: 242692 }, { x: -84534, y: 242464 }, { x: -84763, y: 242692 }],
      [{ x: -84187, y: 242653 }, { x: -84227, y: 242374 }, { x: -83967, y: 242295 }, { x: -83910, y: 242586 }],
      [{ x: -83883, y: 243043 }, { x: -83610, y: 242979 }, { x: -83522, y: 243319 }, { x: -83866, y: 243445 }],
      [{ x: -84069, y: 243286 }, { x: -84350, y: 243427 }, { x: -83092, y: 243601 }, { x: -83930, y: 243333 }],
    ];
    let waypointIndex = 0;

    setInterval(function move() {
      if (waypointIndex >= waypoints.length) {
        waypointIndex = 0;
      }

      const positions = this._getRandomPos(waypoints[waypointIndex]);

      waypointIndex++;
      
      this.emit('move', positions[0], positions[1]);
    }.bind(this), Math.floor(Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000));
  }

  _getRandomPos(coordinates) {
    let xp = coordinates.map(i => i.x);
    let yp = coordinates.map(i => i.y);
		let max = { x: Math.max(...xp), y: Math.max(...yp) };
		let min = { x: Math.min(...xp), y: Math.min(...yp) };
		let x;
		let y;
		
		do {
			x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
			y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
		} while(!this._inPoly(xp, yp, x, y))

		return [x, y]
	}

  _inPoly(xp, yp, x, y){
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
}

module.exports = RunningBot;