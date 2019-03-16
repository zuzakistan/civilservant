/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('owo module', function () {
  before(function () {
    mockBot.loadModule('owo')
  })
  it('should output something vaguely sensible', function () {
    assert.strictEqual(mockBot.runCommand('!owo rrrllleee').includes(' wwwwwweee'), true)
  })
})
