/** @type {string[]} */
const announcements = require('./../../datapack/announcements.json');
const eventBusNew = require('./../Events/EventBusNew');
const serverPackets = require('./../ServerPackets/serverPackets');
/** @typedef {import('./../Models/Player')} Player */

class AnnouncementsManager {
  constructor() {
    /** @type {string[]} */
    this._announcements = [];

    eventBusNew.on('player:enter', this._onPlayerEnter.bind(this));
  }

  /** @returns {void} */
  enable() {
    this._loadInitialAnnouncements();
  }

  /** @returns {string[]} */
  getAnnouncements() {
    return this._announcements;
  }

  /**
   * @param {Player} player
   * @returns {void}
   */
  _onPlayerEnter(player) {
    this._announcements.forEach(announcement => {
      const packet = new serverPackets.CreateSay(0, player.characterName, 10, announcement); // TODO ANNOUNCEMENT = 10
      const client = player.getClient();

      client.sendPacket(packet);
    });
  }

  /** @returns {void} */
  _loadInitialAnnouncements() {
    this._announcements = announcements;
  }
}

module.exports = new AnnouncementsManager();