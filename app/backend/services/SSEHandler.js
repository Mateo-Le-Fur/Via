const SSE = require('./SSEConnection');

class SSEHandler {
  constructor(name) {
    // On créer un map qui va contenir tout les utilisateurs connecté
    this.clients = new Map();
    this.name = name;
  }

  // créer une connexion avec un utilisateur
  newConnection(id, res) {
    console.log(`Nouvelle connection sur le salon ${this.name} avec l'id ${id}`);
    // On instancie la classe SSE
    const client = new SSE(res);
    // On set les headers
    client.init();
    // On ajoute l'utilisateur qui se connecte dans le Map avec en clef son id, et en valeur
    // une instance de la classe SSE
    // Cela permet d'avoir un tableau avec pour chaque utilisateur sa propre instance
    this.clients.set(id, client);
  }

  // Les data seront envoyé seulement à l'utilisateur courant
  sendDataToClient(id, data, event) {
    // On récupere le client dans le tableau avec son id
    const client = this.clients.get(id);
    // Si l'id du client est contenue dans le tableau alors on peut envoyé des données
    if (client) {
      // On envoie un message avec les données et le type d'event
      client.send(data, event);
    }
  }

  // On parcour toutes les connections et on envoie les data pour chacunes d'entre elles */
  broadcast(data, event) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [id] of this.clients) {
      this.sendDataToClient(id, data, event);
    }
  }

  /* On passe un tableau d'id qui contient les utilisateurs qui recevront les données */
  multicast(clientIds, data, event) {
    // eslint-disable-next-line no-restricted-syntax
    for (const id of clientIds) {
      this.sendDataToClient(id, data, event);
    }
  }

  closeConnection(id) {
    console.log(`Déconnection sur le salon ${this.name} avec l'id ${id}`);
    // On delete l'utilisateur dans le tableau de clients
    this.clients.delete(id);
  }
}

module.exports = SSEHandler;
