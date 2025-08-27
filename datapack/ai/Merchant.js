const DefaultNpc = require('./DefaultNpc');

class Merchant extends DefaultNpc {
  constructor(props) {
    super();

    this.fnHi = props.fnHi || "mhi.htm";
    this.fnSell = props.fnSell || "msell.htm";
    this.fnBuy = props.fnBuy || "mbye.htm";
    this.fnUnableItemSell = props.fnUnableItemSell || "muib.htm";
    this.fnYouAreChaotic = props.fnYouAreChaotic || "mcm.htm";
    this.fnNowSiege = props.fnNowSiege || "mns.htm";
    this.sellList0 = [];
    this.sellList1 = [];
    this.sellList2 = [];
    this.sellList3 = [];
    this.sellList4 = [];
    this.sellList5 = [];
    this.sellList6 = [];
    this.sellList7 = [];
    this.buyList0 = [];
    this.buyList1 = [];
    this.buyList2 = [];
    this.buyList3 = [];
    this.buyList4 = [];
  }

  onTalked(talker) {
    this.showPage(talker, this.fnHi);
  }

  onMenuSelected(talker, ask, reply) {
    if (ask === -1) {
      if (reply === 0) {
        this.sell(talker, this.sellList0, "", "");
      }

      if (reply === 1) {
        this.sell(talker, this.sellList1, "", "");
      }
    }
  }
}

module.exports = Merchant;