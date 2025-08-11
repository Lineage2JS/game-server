const DefaultNpc = require('./DefaultNpc');

class GuildMaster extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "gmhi.htm";
    this.fnClassMismatch = props.fnClassMismatch || "gmhi.htm";
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  onMenuSelected(talker, ask, reply) {
    
  }
}

module.exports = GuildMaster;