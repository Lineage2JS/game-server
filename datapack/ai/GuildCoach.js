const DefaultNpc = require('./DefaultNpc');

class GuildCoach extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "ghi.htm";
    this.fnClassMismatch = props.fnClassMismatch || "gcm.htm";
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = GuildCoach;