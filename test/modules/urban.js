/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const mockery = require('mockery')

describe('urban module', function () {
  before(function () {
    // mockery mocks the entire require()
    mockery.enable()
    mockery.registerMock('urban', (headword) => {
      return {
        first: (cb) => {
          /* eslint-disable standard/no-callback-literal */
          switch (headword) {
            case 'one':
              return cb({ definition: 'one two three four', link: 'http://example.com' })
            default:
              return cb(undefined)
          }
          /* eslint-enable standard/no-callback-literal */
        }
      }
    })

    mockBot.loadModule('urban')
  })

  it('should return a definition', async function () {
    let response = await mockBot.runCommand('!ud one')
    assert.strictEqual(response, 'one two three four')
  })

  it('should reject on 404', function () {
    assert.rejects(mockBot.runCommand('!ud two'))
  })

  after(function (done) {
    mockery.disable()
    mockery.deregisterAll()
    done()
  })
})
