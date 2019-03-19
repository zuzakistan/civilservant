const WebhooksApi = require('@octokit/webhooks')
const http = require('http') // core
const colors = require('irc').colors

let server
let webhook
let listener

const announce = (bot, msg) => {
  return bot.notice(bot.config.get('irc.control'), colors.wrap('green', '[github]') + msg)
}

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
    server.close(() => console.log('gh server closed'))
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
    },
    'github:pull_request': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.sender.login} ${ghEvent.action} ${ghEvent.pull_request.html_url}`)
    },
    'github:issue_comment': (bot, ghEvent) => {
      let verb = ghEvent.action
      if (verb === 'created') verb = 'added'
      verb += ' comment on '
      return announce(bot, verb + ghEvent.issue.html_url)
    },
    'github:push': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.sender.login} pushed ${ghEvent.commits.length} commits to ${ghEvent.ref} ${ghEvent.compare}`)
    }
  }
}
