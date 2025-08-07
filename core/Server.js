const net = require('net');
const Client = require('./Client');
const Player = require('./Models/Player');
const playersManager = require('./Managers/PlayersManager');

class Server {
  constructor() {
    this._server = null;
  }

  start(host, port, callback) {
    this._server = net.createServer(this._handler.bind(this));
    
    this._server.on('listening', this._onListening.bind(this, host, port, callback));
    this._server.on('connection', this._onConnection);
    this._server.listen(port, host);
  }

  _onListening(host, port, callback) {
    console.log(`game server listening on ${host}:${port}`);
    
    callback();
  }

  _onConnection() {
    console.log('client connection');
  }

  _handler(socket) {
    const client = new Client(socket);
    const player = new Player(client);

    playersManager.add(player);
  }
}

module.exports = Server;