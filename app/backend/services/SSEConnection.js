/* eslint-disable quote-props */

class SSE {
  // On passe l'objet response dans le constructor pour permettre de renvoyer des données
  constructor(res) {
    this.res = res;
    this.initConnection = new Map();
  }

  // On initialise les headers qui permettent de garder la communication ouverte.
  init() {
    this.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
  }

  // Envoie des données
  send(data, event) {
    this.res.write(`event: ${event}\n`);
    this.res.write(`data: ${JSON.stringify(data)} \n\n`);
  }
}

module.exports = SSE;
