/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('hello world module', function () {
  before(function () {
    mockBot.loadModule('hello')
  })

  it('should say hello', function () {
    assert.strictEqual(mockBot.runCommand('!hello'), 'Hello, world!')
  })
})
