const DefaultNpc = require('./DefaultNpc');

class InstantTeleporter extends DefaultNpc {
  /**
   * @param {{ fnHi?: string }} props
   */
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "thi.htm";
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTeleportRequested(talker) {
    
  }
}

module.exports = InstantTeleporter;