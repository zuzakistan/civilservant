/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('zuzakistan module', function () {
  before(function () {
    mockBot.loadModule('zuzakistan')
  })

  it('should link appropriately', function () {
    assert.strictEqual(mockBot.runCommand('!logs'), 'https://zuzakistan.com/civil-servant/console')
  })
})
