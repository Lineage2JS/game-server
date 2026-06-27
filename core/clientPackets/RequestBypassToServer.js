const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacketNew = require("./ClientPacketNew");
const entitiesManager = require('./../Managers/EntitiesManager');
const aiManager = require('./../Managers/AiManager');
const npcHtmlMessagesManager = require('./../Managers/NpcHtmlMessagesManager');
const itemsManager = require('./../Managers/ItemsManager');
const adminPanelManager = require('./../Managers/AdminPanelManager');

class RequestBypassToServer extends ClientPacketNew {
  static code = 0x21;

  async handle() {
    const client = this.getClient();
    const player = this.getPlayer();
    const command = this.readS();

    if (command === 'admin_show_panel') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('panel');

      client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (command === 'admin_show_teleports') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('teleports');

      client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (command.includes('admin_teleport')) {
      const [x, y, z] = command.split(' ').slice(1).map(i => Number(i)); // fix

      if (!player) return;

      player.x = x;
      player.y = y;
      player.z = z;

      client.sendPacket(new serverPackets.TeleportToLocation(player.objectId, player.x, player.y, player.z));

      return;
    }

    if (command === 'admin_show_items') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('items');

      client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (command === 'admin_show_bots') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('bots');

      client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (command === 'admin_show_gmshop') {
      const items = [];
      const sellList = [
        "small_sword",
        "club",
        "bone_dagger",
      ]

      for(let i = 0; i < sellList.length; i++) {
        const itemId = itemsManager.getItemIdByName(sellList[i]);
        const item = await itemsManager.createItem(itemId);

        if (!item) continue;

        items.push(item);
      }

      client.sendPacket(new serverPackets.BuyList(0, items)); // TODO 0?

      return;
    }

    if (command === 'admin_show_other') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('other');

      client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (command === 'admin_other_ride_strider') {
      if (!player) return;

      client.sendPacket(new serverPackets.Ride(player, 1));

      return;
    }

    if (command === 'admin_other_ride_wyvern') {
      if (!player) return;

      client.sendPacket(new serverPackets.Ride(player, 2));

      return;
    }

    if (command === 'admin_other_earthquake') {
      if (!player) return;

      client.sendPacket(new serverPackets.EarthQuake(player.x, player.y, player.z, 40, 10));

      return;
    }

    if (command.includes('admin_create_item')) {
      const queryParams = command.split('?')[1];
      const params = queryParams.split('&').map(i => {
        const [key, value] = i.split('=');

        return { [key.trim()]: Number(value) };
      }).reduce((a, b) => { return {...a, ...b} });

      const item = await itemsManager.createItem(params.itemId);

      if (!item) return;

      if (item.isStackable) {
        if (params.itemCount && params.itemCount > 0) {
          item.setCount(params.itemCount);
        }
      }

      if (!player) return;

      player.addItem(item);

      const items = player.getItems();

      client.sendPacket(new serverPackets.ItemList(items));

      return;
    }

    if (!player) return;

    const npc = /** @type {import('../Models/Npc') | undefined} */ (entitiesManager.getEntityByObjectId(player.lastTalkedNpcId));

    if (!npc) return;

    if (command === 'talk_select') {
      npc.ai.talkSelect(player);

      return;
    }

    if (command === 'learn_skill') {
      //npc.ai.onLearnSkillRequested(player);

      return;
    }

    if (command.includes('menu_select')) {
      const queryParams = command.split('?')[1];
      const params = queryParams.split('&').map(i => {
        const [key, value] = i.split('=');

        return { [key]: Number(value) };
      }).reduce((a, b) => { return {...a, ...b} });

      npc.ai.menuSelect(player, params.ask, params.reply);

      return;
    }

    if (command === 'teleport_request') {
      npc.ai.teleportRequest(player);

      return;
    }

    if (command.includes('teleport')) { // fix collision? admin_teleport / teleport
      const [x, y, z] = command.split(' ').slice(1).map(i => Number(i)); // fix

      player.x = x;
      player.y = y;
      player.z = z;

      client.sendPacket(new serverPackets.TeleportToLocation(player.objectId, player.x, player.y, player.z));

      return;
    }

    const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName('noquest.htm');

    if (!htmlMessage) return;

    client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
    client.sendPacket(new serverPackets.ActionFailed()); // TODO
  }
}

module.exports = RequestBypassToServer;