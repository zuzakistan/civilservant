const WebhooksApi = require('@octokit/webhooks')
const http = require('http') // core
const colors = require('irc').colors

let server
let webhook
let listener

const announce = (bot, msg) => {
  return bot.notice(bot.config.get('github.channel'), colors.wrap('dark_green', '[github] ') + msg)
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
        case 'check_run':
        case 'check_suite':
        case 'create': /* create branch */
        case 'issue_comment':
        case 'issues':
        case 'pull_request':
        case 'pull_request_review':
        case 'push':
        case 'status':
          return
      }
      announce(bot, colors.wrap('light_gray', `Unknown webhook event ${ghEvent.name}. keys: ${Object.keys(ghEvent.payload)}`))
    },
    'github:issues': (bot, ghEvent) => {
      let actionColors = {
        'opened': 'light_green',
        'edited': 'orange',
        'deleted': 'light_red',
        'transferred': 'light_gray',
        'pinned': 'white',
        'unpinned': 'white',
        'closed': 'dark_red',
        'reopened': 'dark_green',
        'assigned': 'light_cyan',
        'unassigned': 'cyan',
        'labeled': 'light_blue',
        'unlabeled': 'dark_blue',
        'locked': 'gray',
        'unlocked': 'light_gray',
        'milestoned': 'light_magenta',
        'demilestoned': 'magenta'
      }
      let coloredAction = colors.wrap(actionColors[ghEvent.payload.action], ghEvent.payload.action)
      return announce(bot, `${ghEvent.payload.sender.login} ${coloredAction} issue ${ghEvent.payload.issue.html_url}`)
    },
    'github:pull_request': (bot, ghEvent) => {
      if (ghEvent.payload.action === 'synchronize') return
      if (ghEvent.payload.action = 'ready_for_review') ghEvent.payload.action = 'undrafted'
      return announce(bot, `${ghEvent.payload.sender.login} ${ghEvent.payload.action} pull request ${ghEvent.payload.pull_request.html_url}`)
    },
    'github:delete': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.payload.sender.login} deleted branch ${ghEvent.payload.ref}`)
    },
    'github:issue_comment': (bot, ghEvent) => {
      let verb = ghEvent.payload.action
      if (verb === 'created') verb = 'added'
      verb += ' comment on '
      return announce(bot, `${ghEvent.payload.sender.login} ${verb} issue comment ${ghEvent.payload.issue.html_url}`)
    },
    'github:push': (bot, ghEvent) => {
      if (ghEvent.payload.commits.length === 0) return
      return announce(bot, `${ghEvent.payload.pusher.name} pushed ${ghEvent.payload.commits.length} commits to ${ghEvent.payload.ref} ${ghEvent.payload.compare}`)
    },
    'github:pull_request_review': (bot, ghEvent) => {
      return announce(bot, `${ghEvent.payload.sender.login} ${ghEvent.payload.action} code review: ${ghEvent.payload.review.state} ${ghEvent.payload.review.html_url}`)
    }
  }
}
