const request = require('request-promise')
module.exports = {
  commands: {
    isup: {
      aliases: [ 'get', 'web' ],
      privileged: true,
      help: 'Performs a HTTP(S) request to an arbitrary host.',
      usage: [ 'host' ],
      command: async function (bot, msg) {
        try {
          const res = await request({ url: msg.args.host, resolveWithFullResponse: true })
          let str = 'HTTP/' + res.httpVersion
          str += ' ' + res.req.method + ' ' + res.request.href
          str += ' → ' + res.statusCode

          let flag = ''
          try {
            let headers = [
              res.headers['content-type'],
              res.headers.server,
              res.body.length + 'B'
            ]
            str += ' ' + headers.join(' · ')
          } catch (e) {
            flag = '!'
          }
          return str + flag
        } catch (e) {
          return 'err: ' + e
        }
      }
    }
  }
}
