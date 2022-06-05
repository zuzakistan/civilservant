/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

const data = '0000;<control>;Cc;0;BN;;;;;N;NULL;;;;\n1F46F;WOMAN WITH BUNNY EARS;So;0;ON;;;;;N;;;;;\n0391;GREEK CAPITAL LETTER ALPHA;Lu;0;L;;;;;N;;;;03B1;\n03B1;GREEK SMALL LETTER ALPHA;Ll;0;L;;;;;N;;;0391;;0391'
const tests = {
  /* eslint-disable quote-props */
  // Basic search
  'BUNNY': '👯 WOMAN WITH BUNNY EARS U+1F46F',
  'bunny': '👯 WOMAN WITH BUNNY EARS U+1F46F',
  // Multiple words
  'greek small': 'α GREEK SMALL LETTER ALPHA U+03B1',
  // Regex
  'gr.*k small': 'α GREEK SMALL LETTER ALPHA U+03B1',
  // Search by codepoint
  '1F46F': '👯 WOMAN WITH BUNNY EARS U+1F46F',
  // Unprintable
  null: '<control> U+0000',
  // Failed search
  'Not a bunny': 'No Unicode characters match /Not a bunny/',
  // Reverse lookup
  '👯': '👯 WOMAN WITH BUNNY EARS U+1F46F'
  /* eslint-enable quote-props */
}
describe('unicode module', function () {
  before(function () {
    // Mock up the HTTP request
    mockery.enable()
    mockery.registerMock('request-promise-cache', function () { return data })

    mockBot.loadModule('unicode')
  })

  let i = 1
  for (const word in tests) {
    it(`should find matching characters (${i++})`, async function () {
      const promise = await mockBot.runCommand(`!unicode ${word}`)
      assert.strictEqual(promise, tests[word])
    })

    after(function (done) {
      mockery.disable()
      mockery.deregisterAll()
      done()
    })
  }
})
describe('unicode module error handling', function () {
  before(function () {
    // Mock up the HTTP request
    mockery.enable()
    mockery.registerMock('request-promise-cache', function () { throw new Error('some kind of problem') })

    mockBot.loadModule('unicode')
  })

  it('should echo an error', async function () {
    const promise = await mockBot.runCommand('!unicode foo')
    assert.strictEqual(promise, 'err: Error: some kind of problem')
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
