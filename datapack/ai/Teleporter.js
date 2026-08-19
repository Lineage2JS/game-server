const DefaultNpc = require('./DefaultNpc');

/** @typedef {{ fnHi?: string }} TeleporterProps */

class Teleporter extends DefaultNpc {
  /**
   * @param {TeleporterProps} [props]
   */
  constructor(props) {
    super();

    this.fnHi = props?.fnHi || "thi.htm";
    /** @type {number[]} */
    this.position = [];
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
    this.teleport(talker, this.position);
  }
}

module.exports = Teleporter;