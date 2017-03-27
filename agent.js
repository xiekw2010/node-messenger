console.log('agent started', process.pid)

const Server = require('./server')
const server = new Server()

server.on('message', (msg) => {
  console.log(`agent ${process.pid} listen message ${JSON.stringify(msg)}`)
})

setTimeout(() => {
  console.log(`agent ${process.pid} broadcast message...`)
  server.broadcast({
  data: {
    oneway: true,
    server: 'server',
    send: 'send message',
  }
})}, 4000)