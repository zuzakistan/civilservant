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
  events: [],
  loadModule: function (module) {
    moduleLoader.loadModule(self, './modules/' + module)
  },
  runCommand: function (text, args) {
    let reply = ''
    const bot = {
      say: function (to, sayMsg) {
        // these don't actually work yet
        reply += sayMsg
      },
      notice: function (to, sayMsg) {
        reply += sayMsg
      },
      config: this.config,
      chans: { '#test': null }
    }

    var msg = {
      body: text.substr(text.search(/ [^!]/) + 1),
      args: text.substr(1).split(/ !?/),
      cmds: text.substr(1, text.search(/ [^!]/) - 1).split(' !').reverse(),
      nick: 'test',
      to: self.channel,
      message: null // normally the raw event from IRC
    }
    if (msg.cmds[0].length === 0) {
      msg.cmds = msg.args.reverse()
    }

    if (args) {
      Object.assign(msg.args, args)
    }

    reply += self.commands[msg.args[0]].command(bot, msg)
    return reply
  }
}
