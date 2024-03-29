/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('mutations module', function () {
  before(function () {
    mockBot.loadModule('mutations')
  })
  const helpMessage = ['Usage: (soft|nasal|aspirate) <radical>', 'Defnydd: (meddial|trwynol|llaes) <radical>']
  const dictionary = [
    ['soft', 'pxx', 'bxx'],
    ['soft', 'txx', 'dxx'],
    ['soft', 'cxx', 'gxx'],
    ['soft', 'bxx', 'fxx'],
    ['soft', 'dxx', 'ddxx'],
    ['soft', 'gxx', 'xx'],
    ['soft', 'llxx', 'lxx'],
    ['soft', 'lxx', 'lxx'],
    ['soft', 'mxx', 'fxx'],
    ['soft', 'rhxx', 'rxx'],
    ['soft', 'rxx', 'rxx'],
    ['soft', 'aaa', 'aaa'],

    ['nasal', 'pxx', 'mhxx'],
    ['nasal', 'txx', 'nhxx'],
    ['nasal', 'cxx', 'nghxx'],
    ['nasal', 'bxx', 'mxx'],
    ['nasal', 'dxx', 'nxx'],
    ['nasal', 'gxx', 'ngxx'],
    ['nasal', 'xbx', 'xbx'],

    ['aspirate', 'pxx', 'phxx'],
    ['aspirate', 'txx', 'thxx'],
    ['aspirate', 'cxx', 'chxx'],
    ['aspirate', 'xxx', 'xxx'],

    ['nothing', 'foo', helpMessage]
  ]

  dictionary.forEach(function (mutation) {
    const type = mutation[0]
    const original = mutation[1]
    const mutated = mutation[2]

    it(`should handle ${type} mutation of ${original.substr(0, original.length - 2).toUpperCase()}`, function () {
      assert.deepEqual(mockBot.runCommand('!mutate', { type: type, radical: original }), mutated)
    })
  })

  it('should return usage information if nothing sensible entered', function () {
    assert.strictEqual(
      mockBot.runCommand('!mutate', { type: 'xxx', radical: 'xxx' }).toString(),
      helpMessage.toString()
    )
  })
})
