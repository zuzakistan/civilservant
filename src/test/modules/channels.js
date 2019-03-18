/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('channels module', function () {
  before(function () {
    mockBot.loadModule('channels')
  })

  it('should list the multiple channels the bot is in')

  it('should list the single channel the bot is in', function () {
    assert.strictEqual(mockBot.runCommand('!chans'), 'Current channels: #test')
  })
})
