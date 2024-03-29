const fs = require('fs')
const MODULE_DIR = './modules'

function loadModule (self, bot, file) {
  const curr = require(file)
  if (curr.commands) {
    self.addCommands(bot, curr.commands)
  }
  if (curr.events) {
    self.addEvents(bot, curr.events)
  }
  if (curr.onload) {
    bot.log('debug', `Running onload function for ${file}`)
    curr.onload(bot)
  }
}

function enumerateModules (dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, function (err, files) {
      if (err) { reject(err) } else { resolve(files.filter(name => name.substr(-3) === '.js')) }
    })
  })
}

const self = module.exports = {
  loadAllModules: async function (bot, dir) {
    dir = dir || MODULE_DIR // default param
    // clear existing:
    bot.events = {}
    bot.modules = [] // informational only
    bot.commands = []

    const modules = await enumerateModules(dir)
    await Promise.all(modules.map(name => {
      return self.loadModule(bot, `${dir}/${name}`)
        .then(() => bot.modules.push(name))
        .catch((err) => {
          bot.log('error', `Loading ${name} failed`)
          bot.say(bot.config.get('irc.control'), `Failed to load ${name}`)
          if (err.code === 'MODULE_NOT_FOUND') {
            const npmModule = err.message.split('\'')[1]
            bot.log('error', `Dependency missing: run \`npm install --save ${npmModule}\``)
          } else {
            bot.log('error', err)
            bot.log('error', err.stack)
          }
        })
    }))
  },
  loadModule: function (bot, file) {
    const loader = () => loadModule(this, bot, file)
    return Promise.resolve(this.unloadModule(bot, file))
      .catch(err => {
        bot.log('error', `Error in ${file} unload ${err}`)
        bot.say(bot.config.get('irc.control'), `Failed to unload ${file}`)
        return loader()
      })
      .then(loader)
  },
  unloadModule: function (bot, file) {
    // check if module already loaded:
    const filename = require.resolve(file)

    if (filename in require.cache) {
      const alreadyLoadedModule = require(file)
      if (alreadyLoadedModule.onunload) {
        try {
          return alreadyLoadedModule.onunload(bot)
        } catch (e) {
          // output error, but carry on anyway
          bot.log('error', `Error running ${file} onunload hook`)
          bot.log('error', e)
          bot.log('error', e.stack)
        }
      }
    } else {
      // no module loaded -- don't bother unloading
      return
    }

    // delete the the module from cache:
    delete require.cache[filename]
  },
  addCommands: function (bot, commands, clobber) {
    const keys = Object.keys(commands)
    for (let i = 0; i < keys.length; i++) {
      const cmd = commands[keys[i]]
      if (bot.commands[keys[i]] && clobber) {
        bot.log('debug', 'Won\'t clobber: ' + keys[i])
        continue
      }
      bot.commands[keys[i]] = cmd
      bot.log('debug', 'Added command: ' + keys[i])
      if (cmd.aliases) {
        for (let j = 0; j < cmd.aliases.length; j++) {
          bot.commands[cmd.aliases[j]] = commands[keys[i]]
          bot.log('silly', `Aliased ${cmd.aliases[j]} to ${keys[i]}`)
        }
      }
    }
  },
  addEvents: function (bot, events) {
    const keys = Object.keys(events)
    for (let i = 0; i < keys.length; i++) {
      const x = keys[i]
      if (!bot.events[x]) {
        bot.events[x] = []
      }
      bot.events[x].push(events[x])
    }
  }
}
