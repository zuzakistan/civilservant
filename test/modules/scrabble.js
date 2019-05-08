/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('Scrabble module', function () {
  const tests = {
    'a': 'Not a valid word',
    'abcdefghijklmnop': 'Not a valid word',
    'jjjj': 'Not a valid word',
    'jj': '8',
    'jumping': '19',
    'hay': '9',
    'dwarves': '14',
    'flock': '14',
    'quartz': '24',
    'box': '12',
    'OwO': '6'
  }

  before(function () {
    mockBot.loadModule('scrabble')
  })

  for (const word in tests) {
    it('should score Scrabble words correctly', function () {
      assert.strictEqual(mockBot.runCommand('!scrabble', { 'word': word }),
        tests[word])
    })
  }
})
