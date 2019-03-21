/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('unicodemodule', function () {
  const tests = {
    'BUNNY': '👯 WOMAN WITH BUNNY EARS 1F46F',
    'bunny': '👯 WOMAN WITH BUNNY EARS 1F46F',
    '01F7': 'Ƿ WYNN, LATIN CAPITAL LETTER 01F7',
    'Not a valid Unicode character': 'No Unicode characters match /Not a valid Unicode character/'
  }

  before(function () {
    mockBot.loadModule('unicode')
  })

  let i = 1
  for (const word in tests) {
    it(`look up Unicode characters ${i++}`, async function () {
      let promise = await mockBot.runCommand(`!unicode ${word}`)
      assert.strictEqual(promise, tests[word])
    })
  }

  after(function (done) {
    done()
  })
})
