const dgram = require('dgram')

module.exports = {
  onload: (bot) => {
    if (bot.config.has('udp.port')) {
      const PORT = bot.config.get('udp.port')
      const SERVER = bot.config.get('udp.server')
      const server = dgram.createSocket('udp4')

      server.on('message', function (msg, rinfo) {
        bot.fireEvents('udp', msg, rinfo)
      })

      server.bind(PORT, SERVER, () => {
        bot.log('info', `Listening for UDP packets on ${SERVER}:${PORT}`)
      })
    }
  }
}
