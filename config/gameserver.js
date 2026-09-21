const env = {
  GAME_SERVER_ID: process.env.GAME_SERVER_ID ? parseInt(process.env.GAME_SERVER_ID, 10) : undefined,
  GAME_SERVER_HOST: process.env.GAME_SERVER_HOST || undefined,
  GAME_SERVER_PORT: process.env.GAME_SERVER_PORT ? parseInt(process.env.GAME_SERVER_PORT, 10) : undefined,
  GAME_SERVER_AGE_LIMIT: process.env.GAME_SERVER_AGE_LIMIT ? parseInt(process.env.GAME_SERVER_AGE_LIMIT, 10) : undefined,
  GAME_SERVER_IS_PVP: process.env.GAME_SERVER_IS_PVP ? process.env.GAME_SERVER_IS_PVP === 'true' : undefined,
  GAME_SERVER_MAX_PLAYERS: process.env.GAME_SERVER_MAX_PLAYERS ? parseInt(process.env.GAME_SERVER_MAX_PLAYERS, 10) : undefined
};

module.exports = {
  id: env.GAME_SERVER_ID ?? 1,
  host: env.GAME_SERVER_HOST || "127.0.0.1",
  port: env.GAME_SERVER_PORT || 7777,
  ageLimit: env.GAME_SERVER_AGE_LIMIT ?? 0,
  isPvP: env.GAME_SERVER_IS_PVP ?? false,
  maxPlayers: env.GAME_SERVER_MAX_PLAYERS || 100
}