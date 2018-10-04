/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('rot13 module', function () {
  before(function () {
    mockBot.loadModule('rot13')
  })

  it('should ROT13', function () {
    assert.strictEqual(mockBot.runCommand('!rot13 abjurer nowhere'), 'nowhere abjurer')
  })

  const STR = 'All human beings are free and equal in dignity and rights'
  const VALUES = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

  VALUES.forEach(function (num) {
    it(`should return the same string if ROT${num}d then ROT${26 - num}'d`, function () {
      let command = `!rot ${num} ${STR}`
      assert.strictEqual(mockBot.runCommand(`!rot ${26 - num} ${mockBot.runCommand(command)}`), STR)
    })
  })
})
