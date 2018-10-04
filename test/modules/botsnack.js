/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('botsnack module', function () {
  before(function () {
    mockBot.loadModule('botsnack')
  })
  it('should reply with sufficient gratitude', function () {
    assert.strictEqual(mockBot.runCommand('!botsnack'), 'Yum!!')
  })
})
