const DefaultNpc = require('./DefaultNpc');

class Teleporter extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "thi.htm";
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  onTeleportRequested(talker) {
    const position = [1010004, -80749, 149834, -3043, 18000, 0]; // fix

    this.teleport(talker, position);
  }
}

module.exports = Teleporter;