const Citizen = require('./Citizen');

class NewbieGuide extends Citizen {
  onMenuSelected(talker, ask, reply) {
    if (ask === -7 && reply === 1) {
      //
    }
  }
}

module.exports = NewbieGuide;