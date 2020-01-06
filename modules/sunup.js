var suncalc = require('suncalc')
require('date-util')
module.exports = {
  commands: {
    sunup: {
      aliases: ['sunup', 'sunrise'],
      help: 'Returns solar data for Aberystwyth',
      command: function (bot, msg) {
        var date = new Date()
        if (msg.args[1]) {
          msg.args.shift()
          date = new Date().strtotime(msg.args.join(' '))
        }
        var times = suncalc.getTimes(date, 54.4140, -4.0810)
        var str = 'On ' + times.sunrise.format('dS mmm yyyy')
        str += ', the sun rises at ' + times.sunrise.format('HH:MM')
        str += ' and sets at ' + times.sunset.format('HH:MM')
        str += ', with solar noon at ' + times.solarNoon.format('HH:MM')
        str += ' and the nadir at ' + times.nadir.format('HH:MM Z') + '.'
        return str
      }
    }
  }
}
