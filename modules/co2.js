const request = require('request-promise')

module.exports = {
  commands: {
    co2: {
      help: 'Displays the most recent atmospheric carbon dioxide value from the NOAA Earth System Research Laboratory',
      command: async () => request.get('http://hqcasanova.com/co2/')
    }
  }
}
