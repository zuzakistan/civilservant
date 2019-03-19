const WebhooksApi = require('@octokit/webhooks')
const http = require('http') // core

let server
let webhook
let listener

const announce = (bot, msg) => bot.notice(bot.config.get('irc.control'), msg)

module.exports = {
  onload: (bot) => {
    webhook = new WebhooksApi({ secret: bot.config.get('github.webhook.secret') })

    server = http.createServer(webhook.middleware)
    listener = webhook.on('*', (webhookEvent) => {
      bot.fireEvents('github', webhookEvent)
      bot.fireEvents(`github:${webhookEvent.name}`, webhookEvent)
    })

    server.listen(bot.config.get('github.webhook.port'))
  },
  onunload: (bot) => {
    webhook.removeListener(listener)
    server.close(()=>console.log('gh server closed'))
  },
  events: {
    github: (bot, ghEvent) => {
      switch (ghEvent.name) {
        case 'status':
        case 'issues':
          return
      }
      announce(bot, `github ${ghEvent.name}`)
    },
    'github:status': (bot, ghEvent) => announce(bot, `github ${ghEvent.name}: ${ghEvent.payload.name} is now ${ghEvent.payload.state} ${ghEvent.payload.description}`),
    'github:issues': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.sender.login} ${ghEvent.action} ${ghEvent.issue.html_url}`)
    }
  }
}
