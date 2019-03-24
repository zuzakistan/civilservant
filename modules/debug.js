module.exports = {
  commands: {
    reject: {
      help: 'Returns a rejected promise',
      command: function () {
        return Promise.reject(new Error('This is a test rejection.'))
      }
    },
    fakenews: {
      help: 'Queues a fake news story',
      privileged: true,
      command: (bot) => {
        bot.fireEvents('news', {
          color: 'light_blue',
          id: 'test' + Math.random() * 1000,
          text: 'This is a test of the news system: poll',
          prompt: 'TEST'
        })
      }
    },
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
        return old + '->' + bot.config.get(msg.args.setting).toString()
      }
    }
  }
}
