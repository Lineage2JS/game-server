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
    
  }
}

module.exports = Teleporter;