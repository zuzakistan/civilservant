const dgram = require('dgram')
const server = dgram.createSocket('udp4')

module.exports = {
  events: {
    udp: function (bot, msg, rinfo) {
      console.log(msg, rinfo)
      if (rinfo.address === bot.config.get('yakc.ip')) {
        bot.fireEvents('yakc', msg.toString(), rinfo)
      } else {
        bot.notice(bot.config.get('udp.channel'), msg.toString())
      }
    }
  },
  onload: (bot) => {
    if (!bot.config.has('udp.port')) return

    server.on('message', (msg, rinfo) => {
      bot.fireEvents('udp', msg, rinfo)
    })

    server.bind(bot.config.get('udp.port'))
    console.log(JSON.stringify(bot.config.get('udp.port')))
    console.log('Listening to UDP packets on ' + bot.config.get('udp.port'))
  },
  onunload: () => server.close(() => {
    console.log('UDP server closed')
  })
}
