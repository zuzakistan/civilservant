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
    }
  }
}
