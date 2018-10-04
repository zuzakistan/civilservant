/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('caw module', function () {
  before(function () {
    mockBot.loadModule('caw')
  })

  it('should caw on demand', function () {
    assert.notStrictEqual(mockBot.runCommand('!caw').match(/^ca+w+/i), null)
  })

  it('should caw on trigger')
})
