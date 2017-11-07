var bot = require('..')
var dgram = require('dgram')

var server = dgram.createSocket('udp4')

server.on('message', function (msg, rinfo) {
  bot.fireEvents('udp', msg, rinfo)
})

server.bind(bot.config.udp.port)
console.log('Listening for UDP packets on ' + bot.config.udp.port)
