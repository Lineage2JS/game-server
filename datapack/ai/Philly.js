const WharfKeeper = require('./WharfKeeper');

class Philly extends WharfKeeper {
  /**
   * @param {import('./Merchant').MerchantProps} props
   */
  constructor(props) {
    super(props);

    /**
     * @type {Array<import('./Merchant').Item>}
     */
    this.sellList0 = [
      // {"boat_ticket_talk_glu": 20},
      // {"boat_ticket_glu_talk": 20},
      // {"boat_ticket_talk_kiran": 20},
      // {"boat_ticket_kiran_talk": 20},
    ];
  }
}

module.exports = Philly;