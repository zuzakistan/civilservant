/**
 * concern.js
 *
 * !concern
 * Toggles whether the bot should interrupt charged conversations
 * with an unhelpful message.
 */
const isEmotional = require('emotional_alert')
let nox = false
const colors = require('irc').colors
const verbose = false // TODO: cvar

module.exports = {
  commands: {
    sentiment: {
      help: 'Runs a phrase through very nuanced sentiment analysis',
      command: (bot, msg) => {
        const result = isEmotional(msg.body)
        if (result.bayes) {
          const percentage = (result.bayes.proba * 100).toFixed(2)
          return [
            result.bayes.prediction,
            colors.wrap('light_gray', `(${percentage}%)`)
          ].join(' ')
        }
        return 'no sentiment found'
      }
    },
    rawconcern: {
      aliases: ['rawsentiment'],
      help: 'Runs a phrase through the emotional alert system',
      command: (bot, msg) => {
        return JSON.stringify(isEmotional(msg.body))
      }
    },
    concern: {
      help: 'Toggles announcements of concern',
      command: function () {
        if (!nox) {
          nox = true
          return 'adopting air of unconcern'
        }
        nox = false
        return 'concerning myself with matters'
      }
    }
  },
  events: {
    message: function (bot, nick, to, text) {
      if (!nox) {
        const x = isEmotional(text)
        if (x.emotional) {
          if (x.winner) {
            const adj = {
              0: '',
              1: 'slightly ',
              2: 'rather ',
              3: 'quite ',
              4: 'very ',
              5: 'extremely ',
              6: 'copiously ',
              7: 'agonizingly '
            }
            x.adj = adj[x.emotional] === undefined ? 'a tad ' : adj[x.emotional]
            switch (x.winner) {
              case 'anger':
                x.hwinner = 'angry'
                break
              case 'stress':
                x.hwinner = 'stressed'
                break
              case 'sad':
                /* falls through */
              default:
                x.hwinner = x.winner
            }

            bot.shout(to, nick + ': you seem ' + x.adj + x.hwinner + ' (score: ' + x.emotional + ')')
          } else if (verbose) { // danger phrase
            bot.shout(to, nick + ': that is a worrying thing to say')
          }
        }
      }
    }
  }
}
