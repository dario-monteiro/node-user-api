module.exports = {
    development: {
        database: {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            name: process.env.MYSQL_DATABASE,
            dialect: process.env.DB_DIALECT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    },
    production: {
        database: {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT
        }
    }
};