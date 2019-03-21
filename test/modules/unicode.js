/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

const data = ';\n'.repeat(33) + '1F46F;WOMAN WITH BUNNY EARS;So;0;ON;;;;;N;;;;;\n0391;GREEK CAPITAL LETTER ALPHA;Lu;0;L;;;;;N;;;;03B1;\n03B1;GREEK SMALL LETTER ALPHA;Ll;0;L;;;;;N;;;0391;;0391'
const tests = {
  'BUNNY': '👯 WOMAN WITH BUNNY EARS 1F46F',
  'bunny': '👯 WOMAN WITH BUNNY EARS 1F46F',
  'greek small': 'α GREEK SMALL LETTER ALPHA 03B1',
  '1F46F': '👯 WOMAN WITH BUNNY EARS 1F46F',
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
