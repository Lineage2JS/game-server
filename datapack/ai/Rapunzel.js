const Teleporter = require('./Teleporter');

class Rapunzel extends Teleporter {
  constructor(props) {
    super(props);

    this.position = [
      //[1010004, -80749, 149834, -3043, 18000, 0], // 1010004 - "The Village of Gludin"
      [0, -83956, 243383, -3730, 0, 0]
    ];
  } 
}

module.exports = Rapunzel;