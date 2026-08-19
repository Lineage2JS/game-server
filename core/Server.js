const net = require('net');
const Client = require('./Client');
const Player = require('./Models/Player');
const playersManager = require('./Managers/PlayersManager');

class Server {
  constructor() {
    /** @type {net.Server | null} */
    this._server = null;
  }

  /**
   * @param {string} host
   * @param {number} port
   * @param {() => void} callback
   * @returns {void}
   */
  start(host, port, callback) {
    this._server = net.createServer(this._handler.bind(this));

    this._server.on('listening', this._onListening.bind(this, host, port, callback));
    this._server.on('connection', this._onConnection);
    this._server.listen(port, host);
  }

  /**
   * @param {string} host
   * @param {number} port
   * @param {() => void} callback
   * @returns {void}
   */
  _onListening(host, port, callback) {
    console.log(`game server listening on ${host}:${port}`);

    callback();
  }

  _onConnection() {
    console.log('client connection');
  }

  /**
   * @param {net.Socket} socket
   * @returns {void}
   */
  _handler(socket) {
    const client = new Client(socket);
    const player = new Player();

    client.setPlayer(player);
    player.setClient(client);

    playersManager.add(player);
  }
}

module.exports = Server;