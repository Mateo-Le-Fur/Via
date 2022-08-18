const http = require('http');
require('dotenv').config();
const debug = require('debug')('app:server');

const app = require('./backend');

const port = process.env.PORT ?? 8080;

const server = http.createServer(app);

server.listen(port, () => {
  debug(`Listening on ${port}`);
});
