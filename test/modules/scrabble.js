/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('Scrabble module', function () {
  const tests = {
    'a': 'Not a valid word',
    'abcdefghijklmnop': 'Not a valid word',
    'jjjj': 'Not a valid word',
    'jj': 'Jj* scores 8 points.',
    'jumping': 'JUMPING scores 19 points.',
    'hay': 'HAY scores 9 points.',
    'dwarves': 'DWARVES scores 14 points.',
    'flock': 'FLOCK scores 14 points.',
    'quartz': 'QUARTZ scores 24 points.',
    'box': 'BOX scores 12 points.',
    'OwO': 'OWO* scores 6 points.',
    'xyzzy': 'XYZzY* scores 26 points!'
  }

  before(function () {
    mockBot.loadModule('scrabble')
  })

  for (const word in tests) {
    it(`should score '${word}' correctly`, function () {
      assert.strictEqual(mockBot.runCommand('!scrabble', { 'word': word }),
        tests[word])
    })
  }
})
