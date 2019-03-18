/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('abv module', function () {
  before(function () {
    mockBot.loadModule('abv')
  })

  it('should handle nonsense', function () {
    assert.strictEqual(mockBot.runCommand('!abv eternal september'), 'can\'t compute that')
    assert.strictEqual(mockBot.runCommand('!abv 1234 xxxx'), 'can\'t compute that')
    assert.strictEqual(mockBot.runCommand('!abv xxxx 1234'), 'can\'t compute that')
  })

  it('should do fixed volumes fine', function () {
    assert.strictEqual(mockBot.runCommand('!abv', { volume: 'shot', abv: '40' }), '25ml at 40% ABV is 1 unit(s)')
  })

  it('should do arbitrary volumes fine', function () {
    assert.strictEqual(mockBot.runCommand('!abv', { volume: '25', abv: '40' }), '25ml at 40% ABV is 1 unit(s)')
  })
})
