/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const sinon = require('sinon')

describe('countdown module', function () {
  before(function () {
    mockBot.loadModule('countdown')
  })

  it('outputs a countdown', function () {
    const clock = sinon.useFakeTimers(new Date(2016, 11, 1).getTime())
    assert.strictEqual(mockBot.runCommand('!a50'), 'Article 50 expires in 3 years, 1 month, 30 days and 23 hours')
    clock.restore()
  })

  it('outputs a countdown less than a year to go', function () {
    const clock = sinon.useFakeTimers(new Date(2019, 11, 1).getTime())
    assert.strictEqual(mockBot.runCommand('!a50'), 'Article 50 expires in 1 month, 30 days and 23 hours')
    clock.restore()
  })

  it('outputs a countdown to the second milestone once we have passed the first', function () {
    const clock = sinon.useFakeTimers(new Date(2020, 2, 13).getTime())
    assert.strictEqual(mockBot.runCommand('!a50'), 'The extension request deadline expires in 3 months, 17 days and 23 hours')
    clock.restore()
  })

  it('outputs a countdown to the third milestone once we have passed the second', function () {
    const clock = sinon.useFakeTimers(new Date(2020, 11, 1).getTime())
    assert.strictEqual(mockBot.runCommand('!a50'), 'The transition period expires in 30 days and 23 hours')
    clock.restore()
  })

  it('outputs a countdown when all milestones have elapsed', function () {
    const clock = sinon.useFakeTimers(new Date(3000, 1, 1).getTime())
    assert.throws(() => mockBot.runCommand('!a50'), Error, 'No date available')
    clock.restore()
  })

  it('outputs a countdown with a second to go', function () {
    const clock = sinon.useFakeTimers(new Date('2020-01-31T23:59+01:00').getTime())
    assert.strictEqual(mockBot.runCommand('!a50'), 'Article 50 expires in 1 minute')
    clock.restore()
  })

  it('outputs a countup a second after')

  it('counts down to the 59th PGE in 2020', function () {
    const clock = sinon.useFakeTimers(new Date('2020-12-01').getTime())
    assert.strictEqual(mockBot.runCommand('!ge'), 'Polls open in 3 years, 5 months, 1 day and 7 hours')
    clock.restore()
  })

  it('counts down to the 60th PGE in 2025', function () {
    const clock = sinon.useFakeTimers(new Date(2025, 1, 1).getTime())
    assert.strictEqual(mockBot.runCommand('!ge'), 'Polls open in 4 years, 3 months, 2 days and 7 hours')
    clock.restore()
  })

  it('counts down to poll closure mid-election', function () {
    const clock = sinon.useFakeTimers(new Date('2024-05-02T07:01Z').getTime())
    assert.strictEqual(mockBot.runCommand('!ge'), 'Polls close in 14 hours and 59 minutes')
    clock.restore()
  })

  it('counts down next election immediately after poll closure', function () {
    const clock = sinon.useFakeTimers(new Date('2024-05-02T22:00:01Z').getTime())
    assert.strictEqual(mockBot.runCommand('!ge'), 'Polls open in 5 years, 8 hours, 59 minutes and 59 seconds')
    clock.restore()
  })

  it('outputs a py2 countdown', function () {
    const clock = sinon.useFakeTimers(new Date(2016, 11, 1).getTime())
    assert.strictEqual(mockBot.runCommand('!python2'), 'Python 2.7 support expires in 3 years and 1 month')
    clock.restore()
  })

  it('outputs a py2 countup', function () {
    const clock = sinon.useFakeTimers(new Date(2020, 11, 1).getTime())
    assert.strictEqual(mockBot.runCommand('!python2'), 'Python 2.7 support expired 11 months ago')
    clock.restore()
  })
})
