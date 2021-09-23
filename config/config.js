require('dotenv').config() 

module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_DATABASE_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: "postgres"
  },
  test: {
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "POSTGRES_URI",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}
