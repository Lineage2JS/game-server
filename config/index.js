require('dotenv').config({ path: ['.env.local', '.env'] });
const main = require('./main');
const gameserver = require('./gameserver');
const database = require('./database');

module.exports = {
  main,
  gameserver,
  database,
}