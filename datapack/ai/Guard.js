const DefaultNpc = require('./DefaultNpc');

class Guard extends DefaultNpc {
  constructor(props) {
    super();
    
    this.fnHi = props.fnHi || "chi.htm";
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = Guard;