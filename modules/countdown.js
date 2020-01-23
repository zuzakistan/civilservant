var moment = require('moment')
require('moment-countdown')

let timeout = null

function isPast (date) {
  const now = moment()
  const expiryDate = moment(date)
  return expiryDate.isBefore(now)
}

function nextDate (milestones) {
  for (const milestone in milestones) {
    if (!isPast(milestone.date)) return milestone
  }
  throw new Error('No date available')
}

function nextBrexitDate () {
  const milestones = [
    { name: 'Article 50', date: '2020-01-31T00:00:00+01:00' },
    { name: 'The extension request deadline', date: '2020-06-31T00:00:00+01:00' },
    { name: 'The transition period', date: '2019-12-31T00:00:00+01:00' }
  ]
  return nextDate(milestones)
}

function autoCount (bot, lastTick) {
  const { name, date } = nextBrexitDate()
  const thisTick = moment(date).countdown().toString().split(/, | and /)[0]
  if (lastTick != null && thisTick !== lastTick) {
    bot.broadcast(`${name} expires in ${date}`)
  }
  timeout = setTimeout(autoCount, 1000, bot, thisTick)
}

function expiry (eventInfo) {
  const { name, date } = eventInfo
  const countdown = moment(date).countdown().toString()
  if (isPast(date)) {
    return `${name} expired ${countdown} ago`
  }
  return `${name} expires in ${countdown}`
}

module.exports = {
  commands: {
    a50: {
      help: "Gets the time until the next stage of the UK's withdrawal from the European Union",
      command: function () {
        return expiry(nextBrexitDate())
      }
    },
    ge: {
      help: 'Gets the time until the next Parliamentary General Election',
      command: () => {
        const pollDate = '2024-05-24' // 58th PGE
        const pollStart = moment(pollDate + 'T' + '07:00Z')
        const pollEnd = moment(pollDate + 'T' + '22:00Z')
        const milestones = [
          { name: 'Polls open', date: pollStart },
          { name: 'Polls close', date: pollEnd },
          { name: 'Polls open', date: '2029-05-24T07:00Z' }
        ]
        const { name, date } = nextDate(milestones)
        if (!name) return
        const countdown = moment(date).countdown().toString()
        return `${name} in ${countdown}`
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
