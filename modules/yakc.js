var request = require('request')
module.exports = {
  events: {
    'url:webm.website': function (bot, url, nick, to) {
      var apiUrl = 'http://api.' + url.host + url.pathname + '.json'

      request.get(apiUrl, function (e, r, b) {
        if (r.statusCode !== 200) {
          bot.say(to, 'problem: ' + r.responseCode)
        }
        if (e) {
          bot.say(to, 'problem fetching data')
        } else {
          try {
            var data = JSON.parse(b)
            var history = data.history
            var actions = {}

            for (var i = 0; i < history.length; i++) {
              if (!actions[history[i].action]) {
                actions[history[i].action] = 1
              } else {
                actions[history[i].action] += 1
              }
            }
            bot.log('silly', actions)
            var str = []
            for (var action in actions) {
              if (!Object.prototype.hasOwnProperty.call(actions, action)) {
                continue
              }

              str.push(action)
              if (actions[action] > 1) {
                str.push('×' + actions[action])
              }
              str.push('·')
              break // for now only want initial sysadmin comment
            }
            str.push('currently ' + data.queue)
            bot.say(to, str.join(' '))
          } catch (e) {
            // pass
          }
        }
      })
    }
  }
}
