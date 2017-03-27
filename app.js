console.log('app  started', process.pid)

const Client = require('./client')
const client = new Client()

setTimeout(() => {
  console.log(`worker ${process.pid} sending message...`)
  client.send({
    oneway: true,
    data: {
      hello: 'hello',
      world: 'world'
    }
  })
}
  , 1000)

client.on('message', (msg) => console.log(`worker ${process.pid} listen message ${JSON.stringify(msg)}`))