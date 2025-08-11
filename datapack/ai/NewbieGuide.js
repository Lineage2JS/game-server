const Citizen = require('./Citizen');

class NewbieGuide extends Citizen {
  constructor(props) {
    super(props); // fix all всем пробрасывать

    this.fnHi = props.fnHi;
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  onMenuSelected(talker, ask, reply) {
    if (ask === -7 && reply === 1) {
      //
    }
  }
}

module.exports = NewbieGuide;