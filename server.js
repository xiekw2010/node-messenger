const EventEmitter = require('events');
const net = require('net')
const Client = require('./client')
const path = require('path')
const os = require('os');
const { sockPath } = require('./const')
const fs = require('fs')

class Server extends EventEmitter {
  constructor() {
    super()
    this.server = net.createServer(this._handleConnection.bind(this))
    this.listen()
    this.sockets = new Map()
  }

  listen(cb) {
    if (fs.existsSync(sockPath)) {
      fs.unlinkSync(sockPath)
    }
    this.server.listen(sockPath, cb)
    console.log('server listening on', sockPath)
  }

  _handleConnection(socket) {
    const client = new Client({ socket })
    client.on('message', message => {
      this.emit('message', message, client)
    })
    this.sockets.set(socket, client)
  }

  broadcast(msg) {
    for (const sock of this.sockets.keys()) {
      this.sockets.get(sock).send(msg);
    }
  }
}

module.exports = Server
