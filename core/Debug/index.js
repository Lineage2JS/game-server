const eventBus = require('./../Events/EventBusNew');
const serverPackets = require('./../ServerPackets/serverPackets');
const database = require('./../../database');

eventBus.on('player:move', async (player) => {
  const client = player.getClient();
  const objectId = await database.getNextObjectId();
  
  client.sendPacket(new serverPackets.DropItem(player, {
    objectId: objectId,
    itemId: 57, // Adena
    x: player.x,
    y: player.y,
    z: player.z
  }));

  setTimeout((function(client, objId) {
    return function() {
      client.sendPacket(new serverPackets.DeleteObject(objId));
    }
  })(client, objectId), 5000);
});