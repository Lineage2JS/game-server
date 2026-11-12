const serverPackets = require('../ServerPackets/serverPackets');
const announcementsManager = require('./../Managers/AnnouncementsManager');
const enums = require('./../enums');

class PlayerEnterHandler {
  handle(player) {
    const client = player.getClient();
    
    player.updatePAtk();
    player.updateMSpd();
    player.updatePSpd();
    client.sendPacket(new serverPackets.UserInfo(player));
    client.sendPacket(new serverPackets.SunRise()); // TimeManager?
    client.sendPacket(new serverPackets.SystemMessage(enums.SystemMessage.WELCOME_TO_LINEAGE_II));
    announcementsManager.sendAnnouncementsToPlayer(player);
  }
}

module.exports = PlayerEnterHandler;