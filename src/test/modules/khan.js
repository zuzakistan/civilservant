/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('khan module', function () {
  before(function () {
    mockBot.loadModule('khan')
  })

  it('should khan', function () {
    assert.notStrictEqual(mockBot.runCommand('!khan caw').match(/^ca+w+/i), null)
  })
})
