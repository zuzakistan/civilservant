/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

const data = 'WOMAN WITH BUNNY EARS\t1F46F\nWYNN, LATIN CAPITAL LETTER\t01F7'
const tests = {
  'BUNNY': '👯\tWOMAN WITH BUNNY EARS\t1F46F',
  'bunny': '👯\tWOMAN WITH BUNNY EARS\t1F46F',
  'latin': 'Ƿ\tWYNN, LATIN CAPITAL LETTER\t01F7',
  '1F46F': '👯\tWOMAN WITH BUNNY EARS\t1F46F',
  'Not a bunny': 'No Unicode characters match /Not a bunny/'
}
describe('unicode module', function () {
  before(function () {
    mockery.enable()
    mockery.registerMock('request-promise', {
      get: () => Promise.resolve(data)
    })

    mockBot.loadModule('unicode')
  })

  let i = 1
  for (const word in tests) {
    it(`should find matching characters (${i++})`, async function () {
      let promise = await mockBot.runCommand(`!unicode ${word}`)
      assert.strictEqual(promise, tests[word])
    })

    after(function (done) {
      mockery.disable()
      mockery.deregisterAll()
      done()
    })
  }
})
