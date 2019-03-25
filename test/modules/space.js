/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

describe('spacemodule', function () {
  beforeEach(function () {
    let obj = {
      number: 1,
      people: [
        {
          name: 'Alice',
          country: 'archenland'
        },
        {
          name: 'Bob',
          country: 'carlormen'
        },
        {
          name: 'Charlotte',
          country: 'england'
        }
      ]
    }

    mockery.enable()
    mockery.registerMock('request-promise', {
      get: () => Promise.resolve(JSON.stringify(obj))
    })
    mockBot.loadModule('space')
  })

  it('should output correctly', async function () {
    let promise = await mockBot.runCommand('!space')
    assert.strictEqual(promise, 'Alice (archenland); Bob (carlormen); Charlotte (united kingdom)')
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
