const axios = require('axios')
module.exports = {
  commands: {
    isup: {
      aliases: ['get', 'web'],
      privileged: true,
      help: 'Performs a HTTP(S) request to an arbitrary host.',
      usage: ['host'],
      command: async function (bot, msg) {
        const response = await axios(msg.args.host, { responseFormat: 'arraybuffer' })
        const str = [
          response.status,
          response.statusText
        ]

        const headers = [
          response.headers['content-type'],
          response.headers.server,
          response.data.length + 'B'
        ]

        str.push(`(${headers.join(' · ')})`)
        return str.join(' ')
      }
    }
  }
}
