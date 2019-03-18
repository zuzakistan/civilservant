var request = require('request')
module.exports = {
  commands: {
    isup: {
      aliases: [ 'get', 'web' ],
      privileged: true,
      help: 'Performs a HTTP(S) request to an arbitrary host.',
      usage: [ 'host' ],
      command: function (bot, msg) {
        request(msg.args.host, function (err, res, body) {
          if (err) {
            bot.say(msg.to, msg.nick + ': ' + err.message)
          } else {
            var str = 'HTTP/' + res.httpVersion
            str += ' ' + res.req.method + ' ' + res.request.href
            str += ' → ' + res.statusCode

            var flag = ''
            try {
              var headers = [
                res.headers['content-type'],
                res.headers.server,
                body.length
              ]
              str += ' ' + headers.join(' · ')
            } catch (e) {
              flag = '!'
            }
            bot.say(msg.to, msg.nick + ': ' + str + flag)
          }
        })
      }
    }
  }
}
