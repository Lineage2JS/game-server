const net = require('net');
const Client = require('./Client');
const Player = require('./Models/Player');
const playersManager = require('./Managers/PlayersManager');

class Server {
  constructor() {
    this._server = null;
    this._isReady = false;
  }

  start(host, port, callback) {
    this._server = net.createServer(this._handler.bind(this));
    
    this._server.on('listening', this._onListening.bind(this, callback));
    this._server.on('connection', this._onConnection);
    this._server.listen(port, host);
  }

  isReady() {
    return this._isReady;
  }

  _onListening(callback) {
    this._isReady = true;
    
    callback();
  }

  _onConnection() {
    console.log('client connection');
  }

  _handler(socket) {
    const client = new Client(socket);
    const player = new Player();

    client.setPlayer(player);
    player.setClient(client);
    playersManager.addPlayer(player);
  }
}

module.exports = new Server();