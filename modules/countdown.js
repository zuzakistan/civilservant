var moment = require('moment')
require('moment-countdown')

let timeout = null

function isPast (date) {
  const now = moment()
  const expiryDate = moment(date)
  return expiryDate.isBefore(now)
}

function nextBrexitDate () {
  const article50 = '2020-01-31T00:00:00+01:00'
  const transition = '2020-12-31T00:00:00+01:00'

  if (isPast(transition)) {
    return { name: null, date: null }
  }
  if (isPast(article50)) {
    return { name: 'The transition period', date: transition }
  }
  return { name: 'Article 50', date: article50 }
}

function autoCount (bot, lastTick) {
  const eventName = nextBrexitDate.name
  const deadline = nextBrexitDate.date

  if (!eventName) return

  const thisTick = moment(deadline).countdown().toString().split(/, | and /)[0]

  if (lastTick != null && thisTick !== lastTick) {
    bot.broadcast(`${eventName} expires in ${lastTick}`)
  }

  timeout = setTimeout(autoCount, 1000, bot, thisTick)
}

function expiry (eventInfo) {
  const expiryDate = moment(eventInfo.date)
  const eventName = eventInfo.name
  const countdown = expiryDate.countdown().toString()

  if (isPast(expiryDate)) {
    return `${eventName} expired ${countdown} ago`
  }
  return `${eventName} expires in ${countdown}`
}

module.exports = {
  commands: {
    a50: {
      help: "Gets the time until the next stage of the UK's withdrawal from the European Union",
      command: function () {
        return expiry(nextBrexitDate)
      }
    },
    ge: {
      help: 'Gets the time until the 2019 Parliamentary General Election',
      command: () => {
        const date = '2019-12-12' // 58th PGE
        const pollStart = moment(date + 'T' + '07:00Z')
        const pollEnd = moment(date + 'T' + '22:00Z')

        if (!isPast(pollStart)) {
          return 'Polls open in ' + pollStart.countdown().toString()
        }
        if (!isPast(pollEnd)) {
          return 'Polls close in ' + pollEnd.countdown().toString()
        }
        return 'Polls open in ' + moment('2024-05-24').countdown().toString() // 59th PGE
      }
    },
    python2: {
      help: 'Gets the time until Python 2 support is dropped',
      command: function () {
        return expiry({
          name: 'Python 2.7 support',
          date: '2020-01-01T00:00:00Z'
        })
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
