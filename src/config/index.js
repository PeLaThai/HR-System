const dotenv = require('dotenv')
dotenv.config();
const env = process.env.NODE_ENV

const configs = {

    base: {
        env,
        // Application
        host: process.env.HTTP_HOST || 'localhost',
        port: process.env.HTTP_PORT || 8082,

        // Database
        db_host: process.env.DB_HOST || '127.0.0.1',
        db_port: process.env.DB_PORT || 3306,
        db_dialect: process.env.DB_DIALECT || 'mysql',
        db_username: process.env.DB_USERNAME || 'root',
        db_password: process.env.DB_PASSWORD || '123456',
        db_database: process.env.DB_DATABASE || 'vmoproject',
        db_logging: process.env.DB_LOGGING || false,
        db_timezone: process.env.DB_TIMEZONE || "+07:00",

        //Paging
        query_default_page_size: process.env.QUERY_DEFAULT_PAGE_SIZE || 5,
        query_default_page_index: process.env.QUERY_DEFAULT_PAGE_INDEX || 1,

        //Mail
        mail_host: process.env.MAIL_HOST,
        mail_port: process.env.MAIL_PORT,
        mail_username: process.env.MAIL_USERNAME,
        mail_password: process.env.MAIL_PASSWORD,
        mail_from_address: process.env.MAIL_FROM_ADDRESS,
    }
}
const config = Object.assign(configs.base, configs[env]);

module.exports = config;