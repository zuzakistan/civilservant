/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')
const sinon = require('sinon')

const json = JSON.stringify({
  state: 'normal',
  nowTitle: 'Midnight News',
  nowInfo: '20/03/2019',
  nextStart: '2019-03-20T00:30:00Z',
  nextTitle: 'Book of the Week'
})

describe('radio module', function () {
  let sandbox

  before(function () {
    // mockery mocks the entire require()
    mockery.enable()
    mockery.registerMock('request-promise', {
      get: () => Promise.resolve(json)
    })

    // sinon stubs individual functions
    sandbox = sinon.sandbox.create()

    mockBot.loadModule('radio')
  })

  it('should parse the API correctly', async function () {
    sandbox.useFakeTimers({ now: 1553040900000 }) // 2019-03-20T00:15:00Z

    const promise = await mockBot.runCommand('!r4')
    assert.strictEqual(promise, 'Now: \u000300Midnight News\u000f \u000315(20/03/2019)\u000f followed by Book of the Week in 15 minutes (12:30 am)')
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
