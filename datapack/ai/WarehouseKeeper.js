const DefaultNpc = require('./DefaultNpc');

class WarehouseKeeper extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "chi.htm";
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }
}

module.exports = WarehouseKeeper;