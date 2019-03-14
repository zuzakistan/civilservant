const owo = require('@zuzak/owo')
module.exports = {
  commands: {
    owo: {
      help: 'Replies in a furry way',
      command: (bot, msg) => owo(msg.body)
    }
  }
}
