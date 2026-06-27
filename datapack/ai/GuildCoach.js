const DefaultNpc = require('./DefaultNpc');

class GuildCoach extends DefaultNpc {
  /**
   * @param {{ fnHi?: string, fnClassMismatch?: string }} [props]
   */
  constructor(props) {
    super();

    this.fnHi = props?.fnHi || "ghi.htm";
    this.fnClassMismatch = props?.fnClassMismatch || "gcm.htm";
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = GuildCoach;