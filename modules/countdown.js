var moment = require('moment')
require('moment-countdown')

let timeout = null

function autoCount (bot, lastTick) {
  const thisTick = moment('2019-03-29T23:00:00Z').countdown().toString().split(/, | and /)[0]
  if (lastTick != null && thisTick !== lastTick) {
    bot.broadcast('Article 50 expires in ' + thisTick)
  }
  timeout = setTimeout(autoCount, 1000, bot, thisTick)
}

module.exports = {
  commands: {
    a50: {
      help: 'Gets the time until the UK Article 50 procedure expires',
      command: function () {
        return 'Article 50 expires in ' + moment('2019-03-29T23:00:00Z').countdown().toString()
      }
    },
    a50e: {
      help: 'Gets the time until the UK Article 50 procedure expires',
      command: () => 'Article 50, as extended, expires in ' + moment('2019-05-22T23:00:00Z').countdown().toString()
    },
    ge: {
      help: 'Gets the time until the next General Election under FTPA',
      command: () => 'Polls open in ' + moment('2022-05-05T08:00:00Z').countdown().toString()
    },
    python2: {
      help: 'Gets the time until Python 2 support is dropped',
      command: function () {
        return 'Python 2.7 support ends in ' + moment('2020-01-01T00:00:00Z').countdown().toString()
      }
    }
  },
  events: {
    selfjoin: function (bot) {
      if (timeout !== null) return
      autoCount(bot, null)
    }
  }
}
