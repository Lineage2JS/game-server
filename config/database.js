const env = {
  DB_USER: process.env.DB_USER || undefined,
  DB_PASSWORD: process.env.DB_PASSWORD || undefined,
  DB_HOST: process.env.DB_HOST || undefined,
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  DB_NAME: process.env.DB_NAME || undefined
};

module.exports = {
  username: env.DB_USER || 'postgres',
  password: env.DB_PASSWORD || 'root',
  host: env.DB_HOST || '127.0.0.1',
  port: env.DB_PORT || 5432,
  dbname: env.DB_NAME || 'l2db',
}