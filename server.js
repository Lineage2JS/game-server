const Server = require('./core/Server');
const npcManager = require('./core/Managers/NpcManager');
const itemsManager = require('./core/Managers/ItemsManager');
const initialParametersManager = require('./core/Managers/InitialParametersManager');
const announcementsManager = require('./core/Managers/AnnouncementsManager');
const skillsManager = require('./core/Managers/SkillsManager');
const botsManager = require('./core/Managers/BotsManager');
const entitiesManager = require('./core/Managers/EntitiesManager');
const visibilityManager = require('./core/Managers/VisibilityManager');
const npcHtmlMessagesManager = require('./core/Managers/NpcHtmlMessagesManager');
const schedulerManager = require('./core/Managers/SchedulerManager');
const eventSubscribers = require('./core/Events/EventSubscribers');
const database = require('./database');
const config = require('./config');
const serverStatus = require('./enums/serverStatus');
const serverTypes = require('./enums/serverTypes');
const server = new Server();
const isDebug = process.argv.includes('--debug');

async function run() {
  try {
    await database.connect(
      config.database.username,
      config.database.password,
      config.database.host,
      config.database.port,
      config.database.dbname,
      () => {
        console.log("database connected: success");
    });
  } catch(e) {
    const error = /** @type {Error} */ (e);

    console.log(error.message);

    return;
  }

  try {
    server.start(config.gameserver.host, config.gameserver.port, async () => {
      // console.log('\n');
      // console.log('########################################');
      // console.log('# lineage2js                           #');
      // console.log('# game server                          #');
      // console.log('# Chronicle ....... %s                 #', 'C1');
      // console.log('# Protocol ........ %d                #', 419);
      // console.log('# Version. ........ %s              #', '0.0.1');
      // console.log('########################################');
      // console.log('\n');

      const isGameServerExists = await database.checkGameServerExists(config.gameserver.id);

      if (!isGameServerExists) {
        await database.addGameServer({
          id: config.gameserver.id,
          host: config.gameserver.host,
          port: config.gameserver.port,
          ageLimit: config.gameserver.ageLimit,
          isPvP: config.gameserver.isPvP,
          maxPlayers: config.gameserver.maxPlayers,
          status: serverStatus.STATUS_DOWN,
          type: serverTypes.SERVER_NORMAL
        });
      }

      const gameserver = await database.getGameServerById(config.gameserver.id);

      if (!gameserver) {
        console.log('Game server not found in database');
        return;
      }

      await database.updateGameServer(gameserver.id, "status", serverStatus.STATUS_UP);

      itemsManager.enable();
      initialParametersManager.enable();
      announcementsManager.enable();
      skillsManager.enable();
      entitiesManager.enable();
      await npcManager.enable();
      //await botsManager.enable();
      visibilityManager.enable();
      npcHtmlMessagesManager.enable();
      await schedulerManager.enable();

      eventSubscribers.subscribe();
    });
  } catch {

  }
}

process.stdin.resume();
process.on('SIGINT', async () => {
  const gameserver = await database.getGameServerById(config.gameserver.id);

  if (!gameserver) {
    console.log('Game server not found in database');
    return;
  }

  await database.updateGameServer(gameserver.id, "status", serverStatus.STATUS_DOWN);

  process.exit(0);
});

if (isDebug) {
  const debug = require('./core/Debug');
}

run();