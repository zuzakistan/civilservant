/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('buttery module', function () {
  before(function () {
    mockBot.loadModule('deprecate')
  })

  const MSG = 'this ambiguous command has been removed, try !quote or !question instead'

  it('should tell you off', function () {
    assert.strictEqual(mockBot.runCommand('!q'), MSG)
  })

  it('should tell you off even if you wrote a lot', function () {
    assert.strictEqual(mockBot.runCommand('!q amo amas amat amamus amatis amant'), MSG)
  })
})
