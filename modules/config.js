module.exports = {
  commands: {
    config: {
      help: 'gets a config string',
      privileged: true,
      usage: ['config'],
      command: (bot, msg) => bot.config.get(msg.args.config).toString()
    },
    configset: {
      help: 'sets a config string',
      privileged: true,
      usage: ['setting', 'value'],
      command: (bot, msg) => {
        const old = bot.config.get(msg.args.setting).toString()
        bot.config.set(msg.args.setting, msg.args.value)
        return old + ' -> ' + bot.config.get(msg.args.setting).toString()
      }
    }
  }
}
