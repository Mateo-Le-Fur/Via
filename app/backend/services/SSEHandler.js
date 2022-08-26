const SSE = require('./SSEConnection');

class SSEHandler {
  constructor() {
    this.clients = new Map();
  }

  newConnection(id, res) {
    console.log(`${id} connecté`);
    const client = new SSE(res);
    client.init();
    this.clients.set(id, client);
  }

  sendDataToClient(id, data, event) {
    const client = this.clients.get(id);
    if (client) {
      console.log(data);
      console.log(event);
      client.send(data, event);
    }
  }

  closeConnection(id) {
    console.log(`${id} déconnecté`);

    this.clients.delete(id);
  }
}

module.exports = SSEHandler;
