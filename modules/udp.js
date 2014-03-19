var bot = require('..')
var dgram = require('dgram')
var server = dgram.createSocket('udp4')
server.on('message', function (msg, rinfo) {
  bot.notice(bot.config.irc.control, msg.toString())
})
server.bind(bot.config.udp.port);
console.log("Listening for UDP packets on " + bot.config.udp.port);
