/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('moosemodule', function () {
  const tests = {
    'A moose once bit my sister': 'A møøse ønce bit mi sister',
    'Monty Python and the Holy Grail': 'Mønti Pythøn ik den Høli Grail',
    'and the land with tithe then boy why tyne Can can cancan': 'ik den land wik tithe then bøi wi tyne Kan kan kancan'
  }

  before(function () {
    mockBot.loadModule('moose')
  })

  let i = 1
  for (const text in tests) {
    it(`translates to Swedish ${i++}`, function () {
      assert.strictEqual(mockBot.runCommand(`!moose ${text}`), tests[text])
    })
  }
})
