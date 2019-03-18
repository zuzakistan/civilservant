/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('rfc module', function () {
  before(function () {
    mockBot.loadModule('rfc')
  })

  it('should link to an rfc', function () {
    assert.strictEqual(mockBot.runCommand('!rfc', { rfc: '1459' }), 'https://tools.ietf.org/html/rfc1459')
  })
})
