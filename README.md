# node-messenger

using file socket to communicate message from different process

## run it

```js
npm i 

node index.js
```

## protocol

header:

```js
/**
  * header 9 byte
  * 1byte for checking oneway|isResponse
  * 4byte packetId
  * 4byte body length
  */
```

body:

plain json object


## how to use

child process:

```js
const Client = require('./client')
const client = new Client()

// listen msg from server
client.on('message', (msg) => console.log(`worker ${process.pid} listen message ${JSON.stringify(msg)}`))

// send msg to server
client.send({
  oneway: true,
  data: {
    hello: 'hello',
    world: 'world'
  }
})
```

main process:

```js
const Server = require('./server')
const server = new Server()

// listen msg from child process
server.on('message', (msg) => {
  console.log(`agent ${process.pid} listen message ${JSON.stringify(msg)}`)
})

// broadcast msg to child process
server.broadcast({
  isResponse: true,
  data: {
    server: 'server',
    send: 'send message',
  }
})
```

## benifit

This communication model works not only in mutli process situation but also works in one process situation(which always be debug mode)