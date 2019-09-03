var fs = require('fs')
const MODULE_DIR = './modules'

function loadModule (self, bot, file) {
  var curr = require(file)
  if (curr.commands) {
    self.addCommands(bot, curr.commands)
  }
  if (curr.events) {
    self.addEvents(bot, curr.events)
  }
  if (curr.onload) {
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

var self = module.exports = {
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
          console.error(`Loading ${name} failed`)
          bot.say(bot.config.get('irc.control'), `Failed to load ${name}`)
          if (err.code === 'MODULE_NOT_FOUND') {
            const npmModule = err.message.split('\'')[1]
            console.error(`Dependency missing: run \`npm install --save ${npmModule}\``)
          } else {
            console.log(err)
            console.log(err.stack)
          }
        })
    }))
  },
  loadModule: function (bot, file) {
    const loader = () => loadModule(this, bot, file)
    return Promise.resolve(this.unloadModule(bot, file))
      .catch(err => {
        console.error(`Error in ${file} unload ${err}`)
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
          console.error(`Error running ${file} onunload hook`)
          console.error(e)
          console.error(e.stack)
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
    var keys = Object.keys(commands)
    for (var i = 0; i < keys.length; i++) {
      var cmd = commands[keys[i]]
      if (bot.commands[keys[i]] && clobber) {
        console.log('Won\'t clobber: ' + keys[i])
        continue
      }
      bot.commands[keys[i]] = cmd
      // console.log( 'Added command: ' + keys[i] );
      if (cmd.aliases) {
        for (var j = 0; j < cmd.aliases.length; j++) {
          bot.commands[cmd.aliases[j]] = commands[keys[i]]
          // console.log( 'Aliased ' + cmd.aliases[j] + ' to ' + keys[i] );
        }
      }
    }
  },
  addEvents: function (bot, events) {
    var keys = Object.keys(events)
    for (var i = 0; i < keys.length; i++) {
      var x = keys[i]
      if (!bot.events[x]) {
        bot.events[x] = []
      }
      bot.events[x].push(events[x])
    }
  }
}
