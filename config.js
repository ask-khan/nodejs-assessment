var config = {};

// Database Configuration.
config.dbConfig = {};
config.dbConfig.url = "mongodb://localhost:27017/mydb";

// Mode
config.mode = {};
// Development Mode.
config.mode.DEVELOPEMENT = 'developement';
// Production Mode.
config.mode.PRODUCTION = 'production';

// Current Mode.
config.mode.CURRENT = {};
config.mode.CURRENT = config.mode.DEVELOPEMENT;

config.mode.PORT = config.mode.CURRENT == config.mode.DEVELOPEMENT ? 3000 : 3001;

module.exports = config;