const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');
const npcManager = require('./../Managers/NpcManager');
const aiManager = require('./../Managers/AiManager');
const npcHtmlMessagesManager = require('./../Managers/NpcHtmlMessagesManager');
const itemsManager = require('./../Managers/ItemsManager');
const adminPanelManager = require('./../Managers/AdminPanelManager');

// fix remove from global
const waypoints = [];
//

class RequestBypassToServer {
  constructor(client, packet) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data
      .readS();

    this._init();
  }

  get command() {
    return this._data.getData()[0];
  }


  async _init() {
    const player = playersManager.getPlayerByClient(this._client);

    if (this.command === 'admin_show_panel') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('panel');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }
    
    if (this.command === 'admin_show_teleports') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('teleports');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (this.command.includes('admin_teleport')) {
      const [x, y, z] = this.command.split(' ').slice(1).map(i => Number(i)); // fix
      
      this._client.sendPacket(new serverPackets.TeleportToLocation(player.objectId, x, y, z));

      return;
    }

    if (this.command === 'admin_show_items') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('items');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (this.command === 'admin_show_bots') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('bots');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (this.command === 'admin_show_gmshop') {
      const items = [];
      const sellList = [
        "small_sword",
        "club",
        "bone_dagger",
      ]

      for(let i = 0; i < sellList.length; i++) {
        const item = await itemsManager.createItemByName(sellList[i]);

        items.push(item);
      }

      this._client.sendPacket(new serverPackets.BuyList(items));

      return;
    }

    if (this.command === 'admin_show_other') {
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('other');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (this.command === 'admin_bots_create_waypoint') {
      const waypoint = { x: player.x, y: player.y };

      waypoints.push(waypoint);

      console.log(waypoints);

      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('bots');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (this.command === 'admin_other_ride_strider') {
      this._client.sendPacket(new serverPackets.Ride(player, 1));

      return;
    }

    if (this.command === 'admin_other_ride_wyvern') {
      this._client.sendPacket(new serverPackets.Ride(player, 2));

      return;
    }

    if (this.command === 'admin_other_earthquake') {
      this._client.sendPacket(new serverPackets.EarthQuake(player.x, player.y, player.z, 40, 10));
      
      return;
    }

    if (this.command === 'admin_bots_delete_waypoint') {
      waypoints.splice(0, waypoints.length);

      console.log(waypoints);
      
      const htmlMessage = adminPanelManager.getHtmlMessageByFileName('bots');

      this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));

      return;
    }

    if (this.command.includes('admin_create_item')) {
      const params = this.command.split("?")[1];
      const [key, value] = params.split("=").map(i => i.trim());

      if (key === 'id') {
        const item = await itemsManager.createItemById(Number(value));

        player.addItem(item);
      }

      const items = player.getItems();

      this._client.sendPacket(new serverPackets.ItemList(items));

      return;
    }
    
    const npc = npcManager.getNpcById(player.lastTalkedNpcId);

    if (this.command === 'talk_select') {
      if (npc.ai.script === 'Carl') {
        aiManager.onTalkSelect(npc.ai.script, player);
      }

      return;
    }

    if (this.command === 'learn_skill') {
      if (npc.ai.script === 'Minx') {
        aiManager.onLearnSkill(npc.ai.script, player);
      }

      return;
    }

    if (this.command.includes('menu_select')) {
      const queryParams = this.command.split('?')[1];
      const params = queryParams.split('&').map(i => {
        const [key, value] = i.split('=');
    
        return { [key]: Number(value) };
      }).reduce((a, b) => { return {...a, ...b} });

      aiManager.menuSelect(npc.ai.script, player, params.ask, params.reply);

      return;
    }
    
    const htmlMessage = npcHtmlMessagesManager.getHtmlMessageByFileName('noquest.htm');
    
    this._client.sendPacket(new serverPackets.NpcHtmlMessage(htmlMessage));
    this._client.sendPacket(new serverPackets.ActionFailed()); // fix?
  }
}

module.exports = RequestBypassToServer;