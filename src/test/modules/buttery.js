/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('buttery module', function () {
  before(function () {
    mockBot.loadModule('buttery')
  })

  it('should output text')
  it('should not output text if suppressed')

  it('should initalise with zero invocations', function () {
    assert.strictEqual(mockBot.runCommand('!bcount'), 'Count since last reload: 0')
  })

  it('should count the number of invocations', function () {
    mockBot.runCommand('!buttery')
    assert.strictEqual(mockBot.runCommand('!bcount'), 'Count since last reload: 1')
  })

  it('should toggle off', function () {
    assert.strictEqual(mockBot.runCommand('!acid'), 'disabled base')
  })

  it('should toggle on', function () {
    assert.strictEqual(mockBot.runCommand('!acid'), 'enabled base')
  })

  it('should toggle off again', function () {
    assert.strictEqual(mockBot.runCommand('!acid'), 'disabled base')
  })
})
