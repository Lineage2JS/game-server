const announcements = require('./../../datapack/announcements.json');
const serverPackets = require('./../ServerPackets/serverPackets');

class AnnouncementsManager {
  constructor() {
    this._announcements = [];
  }

  enable() {
    this._loadInitialAnnouncements();
  }

  getAnnouncements() {
    return this._announcements;
  }

  sendAnnouncementsToPlayer(player) {
    this._announcements.forEach(announcement => {
      const packet = new serverPackets.CreateSay(0, player.characterName, 10, announcement); // TODO ANNOUNCEMENT = 10
      const client = player.getClient();

      client.sendPacket(packet);
    });
  }

  _loadInitialAnnouncements() {
    this._announcements = announcements;
  }
}

module.exports = new AnnouncementsManager();