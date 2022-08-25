const SSE = require('./SSEConnection');

class SSEHandler {
  constructor() {
    this.clients = [];
  }

  newConnection(id, res) {
    const client = new SSE(res);
    client.init();
    this.clients.push(id, client);
  }

  sendDataToClient(id, data) {
    const client = this.clients.find(id);
    if (client) {
      client.send(data);
    }
  }

  closeConnection(id) {
    const index = this.clients.indexOf(id);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }
}

module.exports = SSEHandler;
