/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('numbers module', function () {
  before(function () {
    mockBot.loadModule('numbers')
  })

  it('should count in English', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'en', number: '1' }), 'one')
  })

  it('should count in German', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'de', number: '10' }), 'zehn')
  })

  it('should count in Spanish`', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'es', number: '100' }), 'cien')
  })

  it('should count in Lojban`', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'jb', number: '99' }), 'soso')
  })

  it('should handle the ISO 639 alpha-3 code for Lojban', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'jbo', number: '99' }), 'soso')
  })

  it('should handle a bad language', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'xx', number: '1' }), 'can\'t do that')
  })

  it('should handle a bad number', function () {
    assert.strictEqual(mockBot.runCommand('!num', { lang: 'en', number: 'xx' }), 'can\'t do that')
  })
})
