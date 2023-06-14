const { Sequelize } = require("sequelize");
const config = require("./");

const options = {
    username: config.db_username,
    password: config.db_password,
    database: config.db_database,
    host: config.db_host,
    port: config.db_port,
    dialect: config.db_dialect,
    logging: config.db_logging === true ? console.log : false,
    timezone: config.db_timezone,
    pool: {
        max: 5,
        min: 0,
        idle: 60000,
        acquire: 60000
    },
    define: {
        freezeTableName: true,
        timestamps: false
    }
}
const sequelize = new Sequelize(options);
module.exports = {
    sequelize,
    options
}