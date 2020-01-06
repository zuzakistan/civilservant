var dns = require('dns')

module.exports = {
  commands: {
    rdns: {
      aliases: ['host'],
      help: 'Attempts to look up a domain from an IP address.',
      usage: ['ip'],
      command: function (bot, msg) {
        try {
          dns.reverse(msg.args.ip, function (err, data) {
            if (err) {
              bot.say(msg.to, 'Error:' + err + ' ' + msg.args.ip)
            }
            for (var i = 0; i < data.length; i++) {
              bot.say(msg.to, msg.args.ip + ' → ' + data[i])
            }
          })
        } catch (e) {
          return e.message
        }
      }
    },
    dns: {
      help: 'Attempts to look up an IP address from a domain.',
      usage: ['host'],
      command: function (bot, msg) {
        dns.lookup(msg.args.host, function (err, data) {
          if (err) {
            bot.say(msg.to, 'Error:' + err + ' ' + msg.args.host)
          }
          bot.say(msg.to, msg.args.host + ' → ' + data)
        })
      }
    }
  }
}
