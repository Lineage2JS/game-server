const DefaultNpc = require('./DefaultNpc');

/** @typedef {{ fnHi?: string }} CitizenProps */

class Citizen extends DefaultNpc {
  /**
   * @param {CitizenProps} [props]
   */
  constructor(props) {
    super();

    /** @type {string} */
    this.fnHi = props?.fnHi || "chi.htm";
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = Citizen;