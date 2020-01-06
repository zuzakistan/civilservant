const sowpods = require('pf-sowpods')
const fs = require('fs')
let wordHistory = []
try {
  wordHistory = require(__rootdir + '/data/scrabble.json')
} catch (e) {
  //
}
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
function computeWord (str) {
  let score = scrabbleScore(str)
  let isImpossible = str.length > 15 || str.length < 2 || /[^a-zA-Z]/.test(str) || score === null
  let isAllowable = sowpods.verify(str)

  return {
    word: str,
    formatted: scrabbleNotate(str) + (isAllowable ? '' : '*'),
    isValid: !isImpossible && isAllowable,
    isPossible: !isImpossible,
    isAllowable,
    score
  }
}
function scrabbleNotate (str) {
  let word = str.toLowerCase()
  for (const letter of [...new Set(word)]) {
    if (letter in bag) {
      for (let i = 0; i < bag[letter]['count']; i++) {
        word = word.replace(letter, letter.toUpperCase())
      }
    }
  }
  return word
}
function getPunctuation (bot, score) {
  const minScore = bot.config.get('scrabble.minScore')
  const exclThreshold = bot.config.get('scrabble.exclamationThreshold')
  const numberOfMarks = Math.max(Math.floor((score - minScore) / exclThreshold), 0)
  return '!'.repeat(numberOfMarks) || '.'
}
function scrabbleScore (str) {
  const result = [...new Set(str.toLowerCase())]
    .map(c => scoreLetter(c, str))
    .reduce((a, b) => ({
      'score': a['score'] + b['score'],
      'usedBlanks': a['usedBlanks'] + b['usedBlanks']
    }), { score: 0, usedBlanks: 0 })
  return result['usedBlanks'] > 2 ? null : result['score']
}
function reportScore (bot, word) {
  if (typeof word === 'string') {
    word = computeWord(word)
  }
  if (!word.isPossible) return 'Not a valid word'
  return `${word.formatted} scores ${word.score} points${getPunctuation(bot, word.score)}`
}
module.exports = {
  commands: {
    scrabble: {
      help: 'Scores a word in Scrabble',
      usage: ['word'],
      command: function (bot, msg) {
        return reportScore(bot, msg.args.word)
      }
    },
    words: {
      help: 'List the recorded high-scoring Scrabble words',
      command: () => wordHistory.map(word => computeWord(word).formatted).join(' ')
    },
    belay: {
      privileged: true,
      help: 'Removes the most recent Scrabble word from the history',
      command: () => 'removed ' + wordHistory.pop()
    }
  },
  events: {
    message: function (bot, nick, to, text) {
      if (text.match(bot.config.get('irc.controlChar') + 'scrabble')) return
      let phrase = text.split(/[ '"]/)
      let words = []
      phrase.forEach((word) => {
        word = word.replace(/[^A-Za-z]+$/, '')
        let result = computeWord(word)
        if (wordHistory.map(word => word.toUpperCase()).includes(word.toUpperCase())) return
        if (!result.isPossible) return
        if (bot.config.get('scrabble.sowpodsOnly') && !result.isAllowable) return
        words.push(result)
      })
      const bestWord = words.reduce((a, b) => (a.score > b.score) ? a : b, 0)
      if (bestWord.score >= bot.config.get('scrabble.minScore')) {
        wordHistory.push(bestWord.word)
        bot.shout(to, nick + ': ' + reportScore(bot, bestWord))
        fs.writeFileSync(__rootdir + '/data/scrabble.json', JSON.stringify(wordHistory, null, 4))
      }
    }
  }
}
