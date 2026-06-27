const DefaultNpc = require('./DefaultNpc');

class WarehouseKeeper extends DefaultNpc {
  /**
   * @param {{ fnHi?: string }} props
   */
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "chi.htm";
  }

  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = WarehouseKeeper;