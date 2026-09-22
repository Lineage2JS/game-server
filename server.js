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
const isDebugMode = process.argv.includes('--debug-mode') && process.env.NODE_ENV !== 'production';

async function init() {
  console.log('starting game server...');

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
    console.log(e.message);

    return;
  }

  try {
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

    server.start(config.gameserver.host, config.gameserver.port, () => {
      console.log(`game server listening on ${config.gameserver.host}:${config.gameserver.port}`);
    });
  } catch(e) {
    console.error(e);
  }
}

process.stdin.resume();
process.on('SIGINT', async () => {
  const gameserver = await database.getGameServerById(config.gameserver.id);

  await database.updateGameServer(gameserver.id, "status", serverStatus.STATUS_DOWN);
  process.exit(0);
});

if (isDebugMode) {
  require('./core/debug');
}

init();