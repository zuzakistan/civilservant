const path = require('path') // core

const config = require('../config')
const moduleLoader = require('../modules.js')

global.__rootdir = path.resolve(path.join(__dirname, '..'))

let self
module.exports = self = {
  config: config.loadFile('test/testConfig.json'),
  channel: '#test',
  setChannel: function (channel) {
    self.channel = channel
  },
  commands: {},
  events: {},
  loadModule: function (module) {
    moduleLoader.loadModule(self, './modules/' + module)
  },
  runCommand: function (text, args) {
    const bot = {
      say: function (to, sayMsg) {
        // these don't actually work yet
      },
      notice: function (to, sayMsg) {
      },
      config: this.config,
      chans: { '#test': null }
    }

    const msg = {
      body: text.substr(text.indexOf(' ') + 1),
      args: text.substr(1).split(' '),
      nick: 'test',
      to: self.channel,
      message: null // normally the raw event from IRC
    }

    if (args) {
      Object.assign(msg.args, args)
    }

    const command = self.commands[msg.args[0]].command

    return command(bot, msg)
  }
}
