const DefaultNpc = require('./DefaultNpc');

class GuildMaster extends DefaultNpc {
  /**
   * @param {{ fnHi?: string, fnClassMismatch?: string }} props
   */
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "gmhi.htm";
    this.fnClassMismatch = props.fnClassMismatch || "gmhi.htm";
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
    
  }
}

module.exports = GuildMaster;