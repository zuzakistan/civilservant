var moment = require('moment')
require('moment-countdown')
module.exports = {
  commands: {
    a50: {
      help: 'Gets the time until the UK Article 50 procedure expires',
      command: function () {
        return 'Article 50 expires in ' + moment('2019-03-29T23:00:00Z').countdown().toString()
      }
    },
    python2: {
      help: 'Gets the time until Python 2 support is dropped',
      command: function () {
        return 'Python 2.7 support ends in ' + moment('2020-01-01T00:00:00Z').countdown().toString()
      }
    }
  }
}
