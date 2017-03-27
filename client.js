'use strict'

const path = require('path')
const net = require('net')
const EventEmitter = require('events')
const { sockPath } = require('./const')
const is = require('is-type-of')

class Client extends EventEmitter {
  constructor(options) {
    options = options || {}
    super()
    if (options.socket) {
      this._socket = options.socket
    } else {
      this._socket = net.connect(sockPath)
    }
    this._bind()
  }

  _bind() {
    const socket = this._socket
    socket.on('readable', () => {
      try {
        let remaining = false
        do {
          remaining = this._readPacket()
        }
        while (remaining)
      } catch (err) {
        err.name = 'PacketParsedError'
        this.close(err)
      }
    })

    socket.once('close', this.close)
    socket.once('error', this.close)
  }

  _read(n) {
    return this._socket.read(n)
  }

  _readPacket() {
    let body, header

    if (is.nullOrUndefined(this._bodyLength)) {
      header = this._read(9)
      if (!header) {
        return false
      }

      this._bodyLength = header.readUInt32BE(5)
    }

    if (this._bodyLength > 0) {
      body = this._read(this._bodyLength)
      if (!body) {
        return false
      }
    }

    this._bodyLength = null
    let entity = this.decode(body, header)
    setImmediate(() => { this.emit('message', entity) })
    
    return true
  }

  decode(buf, header) {
    const first = header.readUInt8(0)
    const id = header.readUInt32BE(1)
    let data
    if (buf) {
      data = JSON.parse(buf)
    }

    return {
      oneway: !!(first & 0x80),
      isResponse: !!(first & 0x40),
      id,
      data,
    }
  }

  /**
   * header 9 byte
   * 1byte for checking oneway|isResponse
   * 4byte packetId
   * 4byte body length
   * @param {*} msg 
   * eg: {
   *    oneway: false,
   *    isResponse: false,
   *    data: body,
   *    id: msgId,
   * }
   */  
  encode(msg) {
    let first = 0
    if (msg.oneway) first = first | 0x80
    if (msg.isResponse) first = first | 0x40

    const header = new Buffer(9)
    const body = new Buffer(JSON.stringify(msg.data))
    header.fill(0)
    header.writeUInt8(first)
    header.writeUInt32BE(msg.id, 1)
    header.writeUInt32BE(body.length, 5)

    return Buffer.concat([header, body])
  }

  send(msg) {
    this._socket.write(this.encode(msg))
  }

  close(err) {
    console.log(`socket close on process ${process.pid}`)
    if (err) console.log(`socket close with err ${err.message}`)
  }
}

module.exports = Client