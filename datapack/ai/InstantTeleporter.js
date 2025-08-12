const DefaultNpc = require('./DefaultNpc');

class InstantTeleporter extends DefaultNpc {
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

module.exports = InstantTeleporter;