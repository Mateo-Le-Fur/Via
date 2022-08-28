const SSE = require('./SSEConnection');

class SSEHandler {
  constructor() {
    // On créer un map qui va contenir tout les utilisateurs connecté
    this.clients = new Map();
  }

  // Méthode qui permet de créer une connexion avec un utilisateur
  newConnection(id, res) {
    // On instancie la classe SSE
    const client = new SSE(res);
    // On set les headers
    client.init();
    // On ajoute l'utilisateur qui se connecte dans le Map avec en clef son id, et en valeur
    // une instance de la classe SSE
    // Cela permet d'avoir un tableau avec pour chaque utilisateur sa propre instance
    this.clients.set(id, client);
  }

  sendDataToClients(id, data, event) {
    // On récupere le client dans le tableau avec son id
    const client = this.clients.get(id);
    // Si l'id du client est contenue dans le tableau alors on peut envoyé des données
    if (client) {
      // On envoie un message avec les données et le type d'event
      client.send(data, event);
    }
  }

  closeConnection(id) {
    // On delete l'utilisateur dans le tableau de clients
    this.clients.delete(id);
  }
}

module.exports = SSEHandler;
