var sowpods = require('sowpods')

let wordHistory = []
const bag = {
  'a': { count: 9, score: 1 },
  'b': { count: 2, score: 3 },
  'c': { count: 2, score: 3 },
  'd': { count: 4, score: 2 },
  'e': { count: 12, score: 1 },
  'f': { count: 2, score: 4 },
  'g': { count: 3, score: 2 },
  'h': { count: 2, score: 4 },
  'i': { count: 9, score: 1 },
  'j': { count: 1, score: 8 },
  'k': { count: 1, score: 5 },
  'l': { count: 4, score: 1 },
  'm': { count: 2, score: 3 },
  'n': { count: 6, score: 1 },
  'o': { count: 8, score: 1 },
  'p': { count: 2, score: 3 },
  'q': { count: 1, score: 10 },
  'r': { count: 6, score: 1 },
  's': { count: 4, score: 1 },
  't': { count: 6, score: 1 },
  'u': { count: 4, score: 1 },
  'v': { count: 2, score: 4 },
  'w': { count: 2, score: 4 },
  'x': { count: 1, score: 8 },
  'y': { count: 2, score: 4 },
  'z': { count: 1, score: 10 }
}
function scoreLetter (letter, str) {
  try {
    const occurrences = str.toLowerCase().split(letter).length - 1
    const usedBlanks = Math.max(occurrences - bag[letter]['count'], 0)
    return {
      score: bag[letter]['score'] * (occurrences - usedBlanks),
      usedBlanks
    }
  } catch (e) {
    if (e instanceof TypeError) {
      return {
        score: 0,
        usedBlanks: 0
      }
    }
  }
}
function scrabbleNotate (str) {
  var word = str.toLowerCase()
  for (var letter of [...new Set(word)]) {
    for (var i = 0; i < bag[letter]['count']; i++) {
      word = word.replace(letter, letter.toUpperCase())
    }
  }
  return word + (sowpods.includes(word.toUpperCase()) ? '' : '*')
}
function getPunctuation (bot, score) {
  const minScore = bot.config.get('scrabble.minScore')
  const exclThreshold = bot.config.get('scrabble.exclamationThreshold')
  const numberOfMarks = Math.max(Math.floor((score - minScore) / exclThreshold), 0)
  return '!'.repeat(numberOfMarks) || '.'
}
function scrabbleScore (str) {
  if (str.length > 15 || str.length < 2 || /[^a-zA-Z]/.test(str)) {
    return null
  }
  const result = [...new Set(str.toLowerCase())]
    .map(c => scoreLetter(c, str))
    .reduce((a, b) => ({
      'score': a['score'] + b['score'],
      'usedBlanks': a['usedBlanks'] + b['usedBlanks']
    }))
  return result['usedBlanks'] > 2 ? null : result['score']
}
module.exports = {
  commands: {
    scrabble: {
      help: 'Scores a word in Scrabble',
      usage: [ 'word' ],
      command: function (bot, msg) {
        const score = scrabbleScore(msg.args.word)
        if (score) {
          return `${scrabbleNotate(msg.args.word)} scores ${score} ` +
          `points${getPunctuation(bot, score)}`
        } else {
          return 'Not a valid word'
        }
      }
    },
    words: {
      help: 'List the recorded high scoring Scrabble words',
      command: () => wordHistory.join(' ')
    }
  },
  events: {
    message: function (bot, nick, to, text) {
      var wordScores = {}
      for (const word of text.split(/[^A-Za-z]/).map(scrabbleNotate)) {
        if (wordHistory.includes(word)) continue
        wordScores[word] = scrabbleScore(word.replace('*', ''))
      }
      const bestWord = Object.keys(wordScores)
        .reduce((a, b) => wordScores[a] > wordScores[b] ? a : b, 0)
      if (wordScores[bestWord] >= bot.config.get('scrabble.minScore') &&
          !text.match(bot.config.get('irc.controlChar') + 'scrabble')) {
        wordHistory.push(bestWord)
        bot.shout(to, `${nick}: ${bestWord} scores ${wordScores[bestWord]} ` +
          `points${getPunctuation(bot, wordScores[bestWord])}`)
      }
    }
  }
}