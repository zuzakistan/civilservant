var moment = require('moment')
require('moment-countdown')

let timeout = null

const ARTICLE_50 = '2020-01-31T00:00:00+01:00'

function autoCount (bot, lastTick) {
  const thisTick = moment(ARTICLE_50).countdown().toString().split(/, | and /)[0]
  if (lastTick != null && thisTick !== lastTick) {
    bot.broadcast('Article 50 expires in ' + lastTick)
  }
  timeout = setTimeout(autoCount, 1000, bot, thisTick)
}

module.exports = {
  commands: {
    a50: {
      help: 'Gets the time until the UK Article 50 procedure expires',
      command: function () {
        return 'Article 50 expires in ' + moment(ARTICLE_50).countdown().toString()
      }
    },
    ge: {
      help: 'Gets the time until the 2019 Parliamentary General Election',
      command: () => {
        const now = moment()

        const date = '2019-12-12' // 58th PGE
        const pollStart = moment(date + 'T' + '07:00Z')
        const pollEnd = moment(date + 'T' + '22:00Z')

        if (now.isBefore(pollStart)) {
          return 'Polls open in ' + pollStart.countdown().toString()
        }
        if (now.isBefore(pollEnd)) {
          return 'Polls close in ' + pollEnd.countdown().toString()
        }
        return 'Polls open in ' + moment('2024-05-24').countdown().toString() // 59th PGE
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
