var moment = require('moment-timezone')
module.exports = {
  commands: {
    tz: {
      help: 'Get the time in a given time zone',
      alias: 'tz',
      usage: 'foo',
      command: function (bot, msg) {
        var output = []
        if (msg.args.length === 1) {
          msg.args = [
            msg.args[0],
            'America/Los_Angeles',
            'America/New_York',
            'Europe/London',
            'Europe/Paris',
            'Europe/Moscow',
            'Asia/Shanghai',
            'Asia/Tokyo'
          ]
        }
        for (var i = 1; i < msg.args.length; i++) {
          output.push(moment(+new Date()).tz(msg.args[i]).format('ha z'))
        }
        return output.join(' · ')
      }
    }
  }
}
