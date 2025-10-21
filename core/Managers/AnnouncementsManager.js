const announcements = require('./../../datapack/announcements.json');

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

  _loadInitialAnnouncements() {
    this._announcements = announcements;
  }
}

module.exports = new AnnouncementsManager();