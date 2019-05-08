function scoreLetter (letter, str) {
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
  const occurrences = str.toLowerCase().split(letter).length - 1
  const usedBlanks = Math.max(occurrences - bag[letter]['count'], 0)
  return {
    score: bag[letter]['score'] * (occurrences - usedBlanks),
    usedBlanks
  }
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
        return String(scrabbleScore(msg.args.word) || 'Not a valid word')
      }
    }
  }
}