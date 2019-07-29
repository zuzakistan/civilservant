/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

describe('co2 module', function () {
  let response = '411.50ppm'

  before(function () {
    // mockery mocks the entire require()
    mockery.enable()
    mockery.registerMock('request-promise', {
      get: () => Promise.resolve(response)
    })

    mockBot.loadModule('co2')
  })

  it('should get the data correctly', async function () {
    let promise = await mockBot.runCommand('!co2')
    assert.strictEqual(promise, response)
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
