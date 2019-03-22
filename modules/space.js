const request = require('request-promise')
module.exports = {
  commands: {
    space: {
      help: 'Displays the people in space right now',
      command: async function (bot, msg) {
        const b = await request.get('http://www.howmanypeopleareinspacerightnow.com/peopleinspace.json')
        const data = JSON.parse(b)
        let ret = data.people.map((person) => {
          if (person.country === 'England') person.country = 'United Kingdom' // pet peeve
          return `${person.name} (${person.country})`
        })
        return ret.join('; ')
      }
    }
  }
}
