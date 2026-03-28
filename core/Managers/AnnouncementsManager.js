const announcements = require('./../../datapack/announcements.json');
const eventBusNew = require('./../Events/EventBusNew');
const serverPackets = require('./../ServerPackets/serverPackets');

class AnnouncementsManager {
  constructor() {
    this._announcements = [];

    eventBusNew.on('player:enter', (player) => {
      this._announcements.forEach(announcement => {
        const packet = new serverPackets.CreateSay(0, player.characterName, 10, announcement); // TODO ANNOUNCEMENT = 10
        const client = player.getClient();

        client.sendPacket(packet);
      });
    });
  }

  enable() {
    this._loadInitialAnnouncements();
  }

  getAnnouncements() {
    return this._announcements;
  }

  _loadInitialAnnouncements() {
    this._announcements = announcements;
  }
}

module.exports = new AnnouncementsManager();