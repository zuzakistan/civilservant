/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('basic functions module', function () {
  before(function () {
    mockBot.loadModule('basicfunctions')
  })

  it('should notice a channel')

  it('should reply with a link to the bot\'s source code', function () {
    assert.strictEqual(mockBot.runCommand('!src'), 'https://github.com/zuzakistan/civilservant')
  })

  it('should know if it is not in the control channel', function () {
    assert.strictEqual(mockBot.runCommand('!control'), 'this is not the control channel')
  })

  it('should know if it is in the control channel', function () {
    const oldChan = mockBot.config.get('irc.control')
    mockBot.config.set('irc.control', mockBot.channel)
    assert.strictEqual(mockBot.runCommand('!control'), 'this is the control channel')
    mockBot.config.set('irc.control', oldChan)
  })

  it('should know if it is quiet', function () {
    const old = mockBot.config.get('irc.quiet')
    mockBot.config.set('irc.quiet', true)
    assert.strictEqual(mockBot.runCommand('!shout'), 'bot is quiet')
    mockBot.config.set('irc.quiet', old)
  })

  it('should know if it is loud', function () {
    const old = mockBot.config.get('irc.quiet')
    mockBot.config.set('irc.quiet', false)
    assert.strictEqual(mockBot.runCommand('!shout'), 'bot is loud')
    mockBot.config.set('irc.quiet', old)
  })
})
