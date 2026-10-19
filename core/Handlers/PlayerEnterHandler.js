const serverPackets = require('../ServerPackets/serverPackets');
const announcementsManager = require('./../Managers/AnnouncementsManager');

class PlayerEnterHandler {
  handle(player) {
    player.mSpd = 333; // TODO?
    const client = player.getClient();

    client.sendPacket(new serverPackets.UserInfo(player));
    client.sendPacket(new serverPackets.SunRise()); // TimeManager?
    client.sendPacket(new serverPackets.SystemMessage(34)); // fix
    announcementsManager.sendAnnouncementsToPlayer(player);
  }
}

module.exports = PlayerEnterHandler;