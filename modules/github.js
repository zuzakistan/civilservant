const WebhooksApi = require('@octokit/webhooks')
const http = require('http') // core
const colors = require('irc').colors

let server
let webhook
let listener

const announce = (bot, msg) => {
  return bot.notice(bot.config.get('irc.control'), colors.wrap('dark_green', '[github] ') + msg)
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
        case: 'check_run':
        case 'status':
          return
      }
      announce(bot, `${ghEvent.name}. keys: ${Object.keys(ghEvent.payload)}`)
    },
    'github:issues': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.payload.sender.login} ${ghEvent.payload.action} ${ghEvent.payload.issue.html_url}`)
    },
    'github:pull_request': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.payload.sender.login} ${ghEvent.payload.action} ${ghEvent.payload.pull_request.html_url}`)
    },
    'github:issue_comment': (bot, ghEvent) => {
      let verb = ghEvent.payload.action
      if (verb === 'created') verb = 'added'
      verb += ' comment on '
      return announce(bot, verb + ghEvent.payload.issue.html_url)
    },
    'github:push': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.payload.pusher.name} pushed ${ghEvent.payload.commits.length} commits to ${ghEvent.payload.ref} ${ghEvent.payload.compare}`)
    },
    'github:pull_request_review': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.payload.sender} ${ghEvent.payload.action} code review: ${ghEvent.payload.review.state} ${ghEvent.payload.review.html_url}`)
    }
  }
}
