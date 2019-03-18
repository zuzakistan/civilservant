/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('timezone module', function () {
  before(function () {
    mockBot.loadModule('timezones')
  })

  it('outputs something vaguely sensible', function () {
    assert.notStrictEqual(mockBot.runCommand('!tz').match(/(\d{1,2}[ap]m [A-Z]{3,4}( · )?){7}/), false)
  })
})
