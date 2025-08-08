const DefaultNpc = require('./DefaultNpc');

class Citizen extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "chi.htm";
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = Citizen;