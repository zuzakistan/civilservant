var moment = require('moment')
require('moment-countdown')

let timeout = null

const ARTICLE_50 = '2020-01-31T00:00:00+01:00'
const TRANSITION = '2020-12-31T00:00:00+01:00'

function autoCount (bot, lastTick) {
  const now = moment()

  var eventName
  var deadline
  if (moment(ARTICLE_50).isBefore(now)) {
    eventName = 'Article 50'
    deadline = ARTICLE_50
  } else {
    eventName = 'The transition period'
    deadline = TRANSITION
  }

  const thisTick = moment(deadline).countdown().toString().split(/, | and /)[0]

  if (lastTick != null && thisTick !== lastTick) {
    bot.broadcast(`${eventName} expires in ${lastTick}`)
  }

  timeout = setTimeout(autoCount, 1000, bot, thisTick)
}

function expiry (name, date) {
  const now = moment()
  const expiryDate = moment(date)
  const countdown = expiryDate.countdown().toString()

  if (expiryDate.isBefore(now)) {
    return `${name} expired ${countdown} ago`
  }
  return `${name} expires in ${countdown}`
}

module.exports = {
  commands: {
    a50: {
      help: 'Gets the time until the UK Article 50 procedure expires',
      command: function () {
        const now = moment()

        if (moment(ARTICLE_50).isBefore(now)) {
          return expiry('The transition period', TRANSITION)
        }
        return expiry('Article 50', ARTICLE_50)
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
    },
    python2: {
      help: 'Gets the time until Python 2 support is dropped',
      command: function () {
        return expiry('Python 2.7 support', '2020-01-01T00:00:00Z')
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
