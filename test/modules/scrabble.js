/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('Scrabble module', function () {
  const tests = {
    'owo': '6',
    'OwO': '6',
    'jjj': '8',
    'jjjj': 'Not a valid word',
    'hello world': 'Not a valid word'
  }

  before(function () {
    mockBot.loadModule('scrabble')
  })

  for (const word in tests) {
    it(`score Scrabble words correctly`, function () {
      assert.strictEqual(mockBot.runCommand(`!scrabble ${word}`), tests[word])
    })
  }
})
