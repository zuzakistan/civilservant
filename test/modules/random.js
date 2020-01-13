/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('random module', function () {
  before(function () {
    mockBot.loadModule('random')
  })

  const tests = [1, 6, 20]
  for (const test in tests) {
    const n = tests[test]
    it(`should return a random integer between 0 and ${n}`, function () {
      const response = mockBot.runCommand(`!random ${n}`)
      const allowableValues = [...Array(n).keys()].map((x) => '' + x)
      assert.ok(allowableValues.includes(response), response)
    })
  }

  it('should return a random number as String', function () {
    assert.deepStrictEqual(typeof mockBot.runCommand('!random 6'), 'string')
  })

  it('should return one value from a choice', function () {
    const choices = 'abcedefghijklmnop'.split('')
    const response = mockBot.runCommand(`!random ${choices.join(' ')}`)
    assert.ok(choices.includes(response), response)
  })
})
