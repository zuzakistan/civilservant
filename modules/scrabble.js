function scrabbleScore (str) {
  let letterCounts = {
    'a': 9,
    'b': 2,
    'c': 2,
    'd': 4,
    'e': 12,
    'f': 2,
    'g': 3,
    'h': 2,
    'i': 9,
    'j': 1,
    'k': 1,
    'l': 4,
    'm': 2,
    'n': 6,
    'o': 8,
    'p': 2,
    'q': 1,
    'r': 6,
    's': 4,
    't': 6,
    'u': 4,
    'v': 2,
    'w': 2,
    'x': 1,
    'y': 2,
    'z': 1
  }
  var usedBlanks = ''
  for (var letter in letterCounts) {
    let pattern = new RegExp(letter, 'gi')
    usedBlanks += letter.repeat(
      Math.max((str.match(pattern) || []).length - letterCounts[letter], 0))
  }
  if (str.length > 15 || usedBlanks.length > 2 || /[^a-zA-Z]/.test(str)) {
    return null
  }
  for (var i = 0; i < usedBlanks.length; i++) {
    let pattern = new RegExp(usedBlanks.charAt(i), 'i')
    str = str.replace(pattern, '')
  }
  return (str.match(/[eaionrtlsu]/gi) || []).length +
    2 * (str.match(/[dg]/gi) || []).length +
    3 * (str.match(/[bcmp]/gi) || []).length +
    4 * (str.match(/[fhvwy]/gi) || []).length +
    5 * (str.match(/k/gi) || []).length +
    8 * (str.match(/[jx]/gi) || []).length +
    10 * (str.match(/[qz]/gi) || []).length
}
module.exports = {
  commands: {
    scrabble: {
      help: 'Scores a word in Scrabble',
      command: function (bot, msg) {
        return String(scrabbleScore(msg.body) || 'Not a valid word')
      }
    }
  }
}
