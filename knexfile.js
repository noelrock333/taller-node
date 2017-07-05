// Update with your config settings.
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'taller_node_db',
      charset: 'utf8'
    },
    debug: true
  },

  /***
  development: {
    client: 'postgresql',
    debug: false,
    connection: process.env.DATABASE_URL || 'postgres://127.0.0.1:5432/taller_node_db',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }, 
  ***/

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};