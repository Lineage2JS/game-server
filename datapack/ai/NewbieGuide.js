const Citizen = require('./Citizen');

class NewbieGuide extends Citizen {
  /**
   * @param {import('./Citizen').CitizenProps} props
   */
  constructor(props) {
    super(props); // fix all всем пробрасывать
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   * @param {number} ask
   * @param {number} reply
   */
  onMenuSelected(talker, ask, reply) {
    if (ask === -7 && reply === 1) {
      //
    }
  }
}

module.exports = NewbieGuide;