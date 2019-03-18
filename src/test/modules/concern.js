/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('concern module', function () {
  before(function () {
    mockBot.loadModule('concern')
  })

  it('should check for concern in each message')

  it('should toggle concern off', function () {
    assert.strictEqual(mockBot.runCommand('!concern'), 'adopting air of unconcern')
  })

  it('should toggle concern on', function () {
    assert.strictEqual(mockBot.runCommand('!concern'), 'concerning myself with matters')
  })

  it('should toggle concern off again', function () {
    assert.strictEqual(mockBot.runCommand('!concern'), 'adopting air of unconcern')
  })
})
