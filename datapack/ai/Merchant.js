const DefaultNpc = require('./DefaultNpc');

/** @typedef {{ fnHi?: string, fnSell?: string, fnBuy?: string, fnUnableItemSell?: string, fnYouAreChaotic?: string, fnNowSiege?: string }} MerchantProps */

/** @typedef {{ [key: string]: number }} Item */

class Merchant extends DefaultNpc {
  /**
   * @param {MerchantProps} [props]
   */
  constructor(props) {
    super();

    /** @type {string} */
    this.fnHi = props?.fnHi || "mhi.htm";
    /** @type {string} */
    this.fnSell = props?.fnSell || "msell.htm";
    /** @type {string} */
    this.fnBuy = props?.fnBuy || "mbye.htm";
    /** @type {string} */
    this.fnUnableItemSell = props?.fnUnableItemSell || "muib.htm";
    /** @type {string} */
    this.fnYouAreChaotic = props?.fnYouAreChaotic || "mcm.htm";
    /** @type {string} */
    this.fnNowSiege = props?.fnNowSiege || "mns.htm";

    /** @type {Array<Item>} */
    this.sellList0 = [];
    /** @type {Array<Item>} */
    this.sellList1 = [];
    /** @type {Array<Item>} */
    this.sellList2 = [];
    /** @type {Array<Item>} */
    this.sellList3 = [];
    /** @type {Array<Item>} */
    this.sellList4 = [];
    /** @type {Array<Item>} */
    this.sellList5 = [];
    /** @type {Array<Item>} */
    this.sellList6 = [];
    /** @type {Array<Item>} */
    this.sellList7 = [];
    /** @type {Array<Item>} */
    this.buyList0 = [];
    /** @type {Array<Item>} */
    this.buyList1 = [];
    /** @type {Array<Item>} */
    this.buyList2 = [];
    /** @type {Array<Item>} */
    this.buyList3 = [];
    /** @type {Array<Item>} */
    this.buyList4 = [];
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