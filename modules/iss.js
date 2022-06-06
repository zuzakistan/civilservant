const axios = require('axios')
module.exports = {
  commands: {
    space: {
      help: 'Displays the people in space right now',
      command: async function (bot, msg) {
        const { data } = await axios.get('http://www.howmanypeopleareinspacerightnow.com/peopleinspace.json')
        console.log(data)
        const people = data.people.map((x) => {
          if (x.country === 'England') x.country = 'United Kingdom'
          return `${x.name} (${x.country})`
        })
        bot.say(msg.to, msg.nick + ': ' + people.join('; '))
      }
    }
  }
}
