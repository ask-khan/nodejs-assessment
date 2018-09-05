const config = require(__dirname + '/config.js');
const app = require('./app.js');

app.listen(config.mode.PORT, () => console.log("listening on port " + config.mode.PORT + "!"));