const lectionary = require('lectionary')
const colors = require('irc').colors
let prevSunday = () => {
  let d = new Date()
  d.setUTCDate(d.getUTCDate() - (7 + d.getUTCDay()) % 7)
  d.setHours(0, 0, 0, 0)
  return d
}
let nextSunday = () => {
  // https://stackoverflow.com/a/43838243/1875784
  let d = new Date()
  d.setUTCDate(d.getUTCDate() + (7 - d.getUTCDay()) % 7)
  d.setHours(0, 0, 0, 0)
  return d
}
const getLectionary = (date) => {
  let dates = lectionary(date.getFullYear(), date.getMonth())
  let day = dates.find((d) => d.date.valueOf() === date.valueOf())
  if (!day) return 'no lectionary entry for then'
  return [
    colors.wrap('gray',
      day.date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      })
    ),
    'is the',
    colors.wrap('white', day.lectionaryLongName),
    colors.wrap('light_gray', `(${day.lectionaryShortName})`),
    colors.wrap('black', `(year ${day.lectionaryYear})`)
  ].join(' ')
}
module.exports = {
  commands: {
    sunday: {
      help: 'Gets the RCL liturgical calendar name for next Sunday',
      command: () => {
        let date = nextSunday()
        return getLectionary(date)
      }
    },
    lsunday: {
      help: 'Gets the RCL liturgical calendar name for last Sunday',
      command: () => {
        let date = prevSunday()
        return getLectionary(date)
      }
    },
    lectionary: {
      help: 'Gets the RCL liturgical calendar name for a date',
      command: (bot, msg) => {
        let date = new Date(msg.body)
        date.setHours(0, 0, 0, 0)
        return getLectionary(date)
      }
    }
  }
}
