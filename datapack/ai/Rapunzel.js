const Teleporter = require('./Teleporter');

class Rapunzel extends Teleporter {
  /**
   * @param {import('./Teleporter').TeleporterProps} props
   */
  constructor(props) {
    super(props);

    /** @type {number[]} */
    this.position = [
      //[1010004, -80749, 149834, -3043, 18000, 0], // 1010004 - "The Village of Gludin"
      ["The Village of Gludin", -83956, 243383, -3730, 18000, 0]
    ];
  }
}

module.exports = Rapunzel;