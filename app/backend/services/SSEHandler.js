const ApiError = require('../errors/apiError');
const SSE = require('./SSEConnection');

class SSEHandler {
  constructor(name) {
    // On créer un Map qui va contenir tout les utilisateurs connecté
    this.clients = new Map();
    this.name = name;
  }

  // créer une connection avec un utilisateur
  newConnection(id, res) {
    const checkConnection = this.clients.get(id);

    // On vérifie que l'utilisateur n'a pas déjà une connection établie
    // Si c'est le cas on la rejette
    if (checkConnection) {
      throw new ApiError('A connection already exists!', 403);
    }

    console.log(`New connection in room [${this.name}] with id ${id}`);
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
    this.clients.forEach((_, id) => {
      this.sendDataToClient(id, data, event);
    });
  }

  /* On passe un tableau d'id qui contient les utilisateurs qui recevront les données */
  multicast(clientIds, data, event) {
    clientIds.forEach((client) => {
      this.sendDataToClient(client, data, event);
    });
  }

  get getCurrentConnection() {
    return this.clients;
  }

  closeConnection(id) {
    console.log(`Disconnection in room [${this.name}] with id ${id}`);
    // On delete l'utilisateur dans le tableau de clients
    this.clients.delete(id);
  }
}

module.exports = SSEHandler;
