const axios = require('axios')
module.exports = {
  commands: {
    govuk: {
      help: 'Returns a random GOV.UK page',
      fireMessageEvent: true,
      command: async function () {
        const res = await axios({
          maxRedirects: 0,
          validateStatus: (x) => 302,
          url: 'https://www.gov.uk/random'
        })
        return res.headers.location
      }
    }
  }
}
