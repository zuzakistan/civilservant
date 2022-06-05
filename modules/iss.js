const request = require('request')
module.exports = {
  commands: {
    space: {
      help: 'Displays the people in space right now',
      command: function (bot, msg) {
        request.get('http://www.howmanypeopleareinspacerightnow.com/peopleinspace.json', function (e, r, b) {
          if (e) {
            bot.say(msg.to, 'problem fetching data')
          }
          if (r.statusCode !== 200) {
            bot.say(msg.to, 'problem fetching data (' + r.statusCode + ')')
          }
          const data = JSON.parse(b)
          const ret = []
          for (let i = 0; i < data.people.length; i++) {
            if (data.people[i].country === 'England') { // pet peeve
              data.people[i].country = 'United Kingdom'
            }
            ret.push(data.people[i].name + ' (' + data.people[i].country + ')')
          }
          bot.say(msg.to, msg.nick + ': ' + ret.join('; '))
        })
      }
    }
  }
}
