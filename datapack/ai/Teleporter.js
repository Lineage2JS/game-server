const DefaultNpc = require('./DefaultNpc');

class Teleporter extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "thi.htm";
    this.position = [];
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  onTeleportRequested(talker) {
    this.teleport(talker, this.position);
  }
}

module.exports = Teleporter;