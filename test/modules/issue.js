/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('issue module', function () {
  before(function () {
    mockBot.loadModule('issue')
  })

  it('should respond with a link', function () {
    assert.strictEqual(mockBot.runCommand('!issue'), 'https://github.com/zuzakistan/civilservant/issues/new')
  })
})
