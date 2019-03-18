var dgram = require('dgram')

module.exports = {
  onload: (bot) => {
    if (bot.config.has('udp.port')) {
      var server = dgram.createSocket('udp4')

      server.on('message', function (msg, rinfo) {
        bot.fireEvents('udp', msg, rinfo)
      })

      server.bind(bot.config.get('udp.port'))
      console.log('Listening for UDP packets on ' + bot.config.get('udp.port'))
    }
  }
}