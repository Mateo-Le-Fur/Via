/* eslint-disable quote-props */
class SSE {
  // On passe l'objet response dans le constructor pour permettre de renvoyer des données
  constructor(res) {
    this.res = res;
  }

  // On initialise les headers qui permettent de communiquer en temps réel
  init() {
    this.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
  }

  // On créer une méthode qui prend les datas et le type d'event en paramètre
  send(data, event) {
    console.log(event);
    this.res.write(`event: ${event}\n`);
    this.res.write(`data: ${JSON.stringify(data)} \n\n`);
  }
}

module.exports = SSE;
